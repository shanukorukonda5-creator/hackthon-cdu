import React, { useState } from 'react';
import GlassCard from '../components/ui/GlassCard';
import GlassButton from '../components/ui/GlassButton';
import Badge from '../components/ui/Badge';
import InputField from '../components/forms/InputField';
import DataTable from '../components/ui/DataTable';
import Tabs from '../components/ui/Tabs';
import { useNotifications } from '../context/NotificationContext';
import accessibilityService from '../services/accessibility.service';
import {
  FiGlobe,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiCpu,
  FiDownload,
  FiAward,
  FiLayers,
  FiFileText,
} from 'react-icons/fi';

const AccessibilityScannerPage = () => {
  const { addToast } = useNotifications();
  const [scanType, setScanType] = useState('url');
  const [targetUrl, setTargetUrl] = useState('https://accessibility-demo.app');
  const [contentText, setContentText] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const [auditData, setAuditData] = useState({
    overallScore: 94,
    rating: 'Excellent',
    categoryScores: {
      readability: 92,
      languageSimplicity: 88,
      accessibility: 94,
      structure: 96,
      navigation: 90,
      inclusiveness: 95,
    },
    badges: [
      { id: 'champion', title: 'Accessibility Champion', level: 'Gold' },
      { id: 'inclusive', title: 'Inclusive Writing', level: 'Gold' },
      { id: 'structure', title: 'Excellent Structure', level: 'Silver' },
    ],
    issues: [
      {
        id: 'issue-1',
        title: 'Low contrast ratio on navigation bar text',
        severity: 'Critical',
        reason: 'Text contrast ratio is 3.2:1 (required 4.5:1 for WCAG Level AA).',
        suggestedFix: 'Darken navigation text to #1E293B.',
        improvedSentence: 'Enhanced contrast navigation bar.',
      },
      {
        id: 'issue-2',
        title: 'Missing main landmark structural element',
        severity: 'High',
        reason: 'Page structure lacks a <main> wrapping element.',
        suggestedFix: 'Wrap central article content in semantic <main> tag.',
        improvedSentence: '<main> <article>Content</article> </main>',
      },
      {
        id: 'issue-3',
        title: 'Decorative banner missing empty alt attribute',
        severity: 'Medium',
        reason: 'Screen readers announce unlabelled decorative image file names.',
        suggestedFix: 'Add alt="" to decorative banner images.',
        improvedSentence: '<img src="banner.png" alt="" />',
      },
    ],
  });

  const handleScan = async (e) => {
    e.preventDefault();
    setIsScanning(true);
    try {
      let res = null;
      if (scanType === 'url') {
        res = await accessibilityService.scanWebsite(targetUrl);
      } else {
        res = await accessibilityService.runAudit(contentText, 'Custom Text Audit');
      }

      if (res.data) {
        setAuditData({
          overallScore: res.data.overallScore || 92,
          rating: res.data.rating || 'Excellent',
          categoryScores: res.data.categoryScores || auditData.categoryScores,
          badges: res.data.badges || auditData.badges,
          issues: res.data.issues || auditData.issues,
        });
        addToast('AI Accessibility Audit completed successfully!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Audit scan failed.', 'error');
    } finally {
      setIsScanning(false);
    }
  };

  const handleExport = async (format) => {
    try {
      let content = '';
      if (format === 'markdown') {
        const res = await accessibilityService.exportMarkdown('current');
        content = res.data?.markdown || '';
      } else if (format === 'json') {
        const res = await accessibilityService.exportJson('current');
        content = res.data?.json || '';
      } else if (format === 'txt') {
        const res = await accessibilityService.exportTxt('current');
        content = res.data?.txt || '';
      } else {
        const res = await accessibilityService.exportPdf('current');
        content = res.data?.pdfText || '';
      }

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Accessibility_Report_${Date.now()}.${format === 'markdown' ? 'md' : format}`;
      a.click();

      addToast(`Exported Audit Report as ${format.toUpperCase()}`, 'success');
    } catch (err) {
      addToast(`Failed to export report as ${format.toUpperCase()}`, 'error');
    }
  };

  const columns = [
    {
      header: 'Severity',
      accessor: 'severity',
      render: (row) => {
        if (row.severity === 'Critical') return <Badge variant="danger">Critical</Badge>;
        if (row.severity === 'High') return <Badge variant="warning">High</Badge>;
        if (row.severity === 'Medium') return <Badge variant="info">Medium</Badge>;
        return <Badge variant="success">Low</Badge>;
      },
    },
    { header: 'Violation Title', accessor: 'title' },
    { header: 'WCAG Impact & Reason', accessor: 'reason' },
    { header: 'Remediation Suggestion', accessor: 'suggestedFix' },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center space-x-3">
            <FiCpu className="text-indigo-400" />
            <span>AI Accessibility Audit & Scoring Platform</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Enterprise-grade WCAG 2.1 auditing, smart scoring (0-100), severity priority engine, and multi-format exports.</p>
        </div>

        {/* Multi-Format Export Buttons */}
        <div className="flex flex-wrap gap-2">
          <GlassButton size="xs" variant="secondary" onClick={() => handleExport('markdown')}>
            <FiDownload className="mr-1" /> Export MD
          </GlassButton>
          <GlassButton size="xs" variant="secondary" onClick={() => handleExport('json')}>
            <FiDownload className="mr-1" /> Export JSON
          </GlassButton>
          <GlassButton size="xs" variant="secondary" onClick={() => handleExport('txt')}>
            <FiDownload className="mr-1" /> Export TXT
          </GlassButton>
          <GlassButton size="xs" variant="primary" onClick={() => handleExport('pdf')}>
            <FiDownload className="mr-1" /> Export PDF
          </GlassButton>
        </div>
      </div>

      {/* Input Mode Tabs */}
      <Tabs
        activeTab={scanType}
        onChange={setScanType}
        tabs={[
          { id: 'url', label: 'Scan Website URL', icon: FiGlobe },
          { id: 'text', label: 'Audit Raw Content Text', icon: FiFileText },
        ]}
      />

      {/* Audit Input Form */}
      <GlassCard>
        <form onSubmit={handleScan} className="space-y-4">
          {scanType === 'url' ? (
            <InputField
              label="Website or Application URL"
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              icon={FiGlobe}
            />
          ) : (
            <textarea
              rows={5}
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              placeholder="Paste content or article text here for full WCAG accessibility analysis..."
              className="glass-input w-full rounded-2xl p-4 text-sm bg-slate-900/60 border border-white/10"
            />
          )}
          <div className="flex justify-end">
            <GlassButton type="submit" variant="primary" loading={isScanning}>
              Run AI Accessibility Audit
            </GlassButton>
          </div>
        </form>
      </GlassCard>

      {/* Overall Score & Category Pillar Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Score Gauge */}
        <GlassCard className="flex flex-col items-center justify-center p-8 text-center border-indigo-500/30 bg-indigo-950/20">
          <p className="text-xs uppercase font-bold text-slate-400">Overall Accessibility Score</p>
          <div className="text-6xl font-black text-indigo-400 mt-2">{auditData.overallScore} / 100</div>
          <Badge variant="success" className="mt-3 text-xs px-3 py-1">
            Rating: {auditData.rating}
          </Badge>
        </GlassCard>

        {/* Pillar Scores Progress Bars */}
        <GlassCard className="md:col-span-2 space-y-3 p-6">
          <h3 className="text-sm font-bold text-slate-200">Category Pillar Breakdown</h3>
          {Object.entries(auditData.categoryScores || {}).map(([pillar, val]) => (
            <div key={pillar} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300 capitalize">{pillar.replace(/([A-Z])/g, ' $1')}</span>
                <span className="text-indigo-400 font-mono">{val}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div style={{ width: `${val}%` }} className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300" />
              </div>
            </div>
          ))}
        </GlassCard>
      </div>

      {/* Achievement Badges Row */}
      {auditData.badges?.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center space-x-2">
            <FiAward className="text-amber-400" />
            <span>Awarded Accessibility Achievement Badges</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {auditData.badges.map((b) => (
              <GlassCard key={b.id} className="flex items-center space-x-3 p-3.5 border-amber-500/20">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg">
                  <FiAward />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{b.title}</h4>
                  <span className="text-[10px] text-amber-300 font-mono">{b.level} Award</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Priority Issues Table */}
      <GlassCard className="space-y-4">
        <h3 className="text-base font-bold text-slate-200">Priority Violation Findings & Remediation</h3>
        <DataTable columns={columns} data={auditData.issues} keyField="id" />
      </GlassCard>
    </div>
  );
};

export default AccessibilityScannerPage;
