'use client';

import { useEffect, useState } from 'react';
import { FileText, Download, RefreshCw, AlertTriangle, CheckCircle, XCircle, Image as ImageIcon, TrendingUp, BarChart3 } from 'lucide-react';

export default function SEOReport() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await fetch('/api/seo/report');
      const data = await res.json();
      setReport(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching SEO report:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    if (score >= 50) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'good':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'fair':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'poor':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const handleExportPDF = () => {
    if (!report) return;

    const pdfContent = `
      <html>
        <head>
          <title>SEO Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 1200px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
              margin-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              color: #333;
            }
            .header p {
              color: #666;
              margin: 5px 0 0;
            }
            .score-card {
              background: #f5f5f5;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 20px;
              text-align: center;
            }
            .score-card h2 {
              margin: 0;
              font-size: 48px;
            }
            .section {
              margin: 20px 0;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 8px;
            }
            .section h3 {
              margin-top: 0;
              color: #333;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            .status {
              padding: 5px 10px;
              border-radius: 3px;
              display: inline-block;
              font-size: 12px;
              font-weight: bold;
            }
            .status-excellent { background-color: #d4edda; color: #155724; }
            .status-good { background-color: #d1ecf1; color: #0c5460; }
            .status-fair { background-color: #fff3cd; color: #856404; }
            .status-poor { background-color: #f8d7da; color: #721c24; }
            .issue-list {
              list-style: none;
              padding: 0;
            }
            .issue-list li {
              padding: 8px 0;
              border-bottom: 1px solid #eee;
            }
            .recommendation-list {
              list-style: none;
              padding: 0;
            }
            .recommendation-list li {
              padding: 8px 0;
              border-bottom: 1px solid #eee;
            }
            .recommendation-list li:before {
              content: "→ ";
              color: #6BCB8F;
            }
            @media print {
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>SEO Report</h1>
            <p>Generated on: ${lastUpdated?.toLocaleString() || new Date().toLocaleString()}</p>
          </div>

          <div class="score-card">
            <h2 style="color: ${report.overallScore >= 90 ? '#28a745' : report.overallScore >= 70 ? '#ffc107' : report.overallScore >= 50 ? '#fd7e14' : '#dc3545'}">${report.overallScore}/100</h2>
            <p>Overall SEO Score</p>
          </div>

          <div class="section">
            <h3>Summary</h3>
            <p><strong>Total Pages:</strong> ${report.totalPages}</p>
            <p><strong>Pages Analyzed:</strong> ${report.pagesAnalyzed}</p>
            <p><strong>Total Issues:</strong> ${report.issues.length}</p>
          </div>

          <div class="section">
            <h3>Image Alt Tag Analysis</h3>
            <p><strong>Total Images:</strong> ${report.imageAnalysis.totalImages}</p>
            <p><strong>Images with Alt Tags:</strong> ${report.imageAnalysis.imagesWithAlt}</p>
            <p><strong>Images without Alt Tags:</strong> ${report.imageAnalysis.imagesWithoutAlt}</p>
            <p><strong>Alt Tag Coverage:</strong> ${report.imageAnalysis.altTagPercentage}%</p>
          </div>

          <div class="section">
            <h3>Page Analysis</h3>
            <table>
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Path</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Issues</th>
                </tr>
              </thead>
              <tbody>
                ${report.pageAnalysis.map((page: any) => `
                  <tr>
                    <td>${page.pageName}</td>
                    <td>${page.pagePath}</td>
                    <td><strong>${page.score}/100</strong></td>
                    <td><span class="status status-${page.status}">${page.status}</span></td>
                    <td>${page.issues.length}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h3>Issues Found</h3>
            <ul class="issue-list">
              ${report.issues.map((issue: any) => `
                <li><strong>${issue.page}:</strong> ${issue.issue}</li>
              `).join('')}
            </ul>
          </div>

          <div class="section">
            <h3>Recommendations</h3>
            <ul class="recommendation-list">
              ${report.recommendations.map((rec: string) => `
                <li>${rec}</li>
              `).join('')}
            </ul>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(pdfContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading SEO Report...</div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Failed to load SEO Report</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">SEO Report</h1>
        <div className="flex gap-2">
          <button
            onClick={fetchReport}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
            style={{ backgroundColor: '#6BCB8F' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5AB87E'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6BCB8F'}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
            style={{ backgroundColor: '#8B4513' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7A3D11'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8B4513'}
          >
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      {lastUpdated && (
        <p className="text-gray-400 text-sm mb-6">
          Last updated: {lastUpdated.toLocaleString()}
        </p>
      )}

      {/* Overall Score Card */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Overall SEO Score</h2>
            <p className="text-gray-400">Based on {report.pagesAnalyzed} active pages</p>
          </div>
          <div className="text-center">
            <div className={`text-6xl font-bold ${getScoreColor(report.overallScore)}`}>
              {report.overallScore}
            </div>
            <div className="text-gray-400">/ 100</div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-gray-400 text-sm">Total Pages</p>
              <p className="text-2xl font-bold text-white">{report.totalPages}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-gray-400 text-sm">Pages Analyzed</p>
              <p className="text-2xl font-bold text-white">{report.pagesAnalyzed}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-gray-400 text-sm">Total Issues</p>
              <p className="text-2xl font-bold text-white">{report.issues.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-gray-400 text-sm">Recommendations</p>
              <p className="text-2xl font-bold text-white">{report.recommendations.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Alt Tag Analysis */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Image Alt Tag Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Total Images</p>
            <p className="text-2xl font-bold text-white">{report.imageAnalysis.totalImages}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">With Alt Tags</p>
            <p className="text-2xl font-bold text-green-500">{report.imageAnalysis.imagesWithAlt}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Without Alt Tags</p>
            <p className="text-2xl font-bold text-red-500">{report.imageAnalysis.imagesWithoutAlt}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Alt Tag Coverage</p>
            <p className={`text-2xl font-bold ${report.imageAnalysis.altTagPercentage >= 80 ? 'text-green-500' : report.imageAnalysis.altTagPercentage >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
              {report.imageAnalysis.altTagPercentage}%
            </p>
          </div>
        </div>
      </div>

      {/* Page Analysis Table */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Page Analysis</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Page Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Path
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Issues
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {report.pageAnalysis.map((page: any, index: number) => (
                <tr key={index} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {page.pageName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {page.pagePath}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-bold ${getScoreColor(page.score)}`}>
                      {page.score}/100
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(page.status)}
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getScoreBgColor(page.score)}`}>
                        {page.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {page.issues.length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issues */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          Issues Found ({report.issues.length})
        </h3>
        <div className="space-y-2">
          {report.issues.map((issue: any, index: number) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg">
              <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">{issue.page}</p>
                <p className="text-sm text-gray-400">{issue.issue}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Recommendations ({report.recommendations.length})
        </h3>
        <div className="space-y-2">
          {report.recommendations.map((rec: string, index: number) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <p className="text-sm text-gray-300">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
