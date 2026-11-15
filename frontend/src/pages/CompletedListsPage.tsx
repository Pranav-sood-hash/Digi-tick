import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { ShoppingList } from '../types';
import { listsApi } from '../services/api';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { useToast } from '../context/ToastContext';
import {
  Archive,
  Search,
  Copy,
  Printer,
  Download,
  Trash2,
  Eye,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const CompletedListsPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const fetchCompletedLists = async () => {
    try {
      const data = await listsApi.getLists('completed');
      setLists(data);
    } catch (err: any) {
      error(err.message || 'Failed to load completed lists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedLists();
  }, []);

  const handleOpenDetailModal = async (listId: string) => {
    try {
      const detailed = await listsApi.getList(listId);
      setSelectedList(detailed);
      setViewModalOpen(true);
    } catch (err: any) {
      error('Failed to load list items');
    }
  };

  const handleReuse = async (id: string) => {
    try {
      const reused = await listsApi.reuseList(id);
      success(`Reused into "${reused.title}" with all items reset to pending!`);
      navigate(`/lists/${reused.id}`);
    } catch (err: any) {
      error(err.message || 'Failed to reuse list');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this completed shopping list?')) return;
    try {
      await listsApi.deleteList(id);
      success('List deleted');
      if (selectedList?.id === id) setViewModalOpen(false);
      fetchCompletedLists();
    } catch (err: any) {
      error(err.message || 'Failed to delete list');
    }
  };

  const handlePrint = (listToPrint: ShoppingList) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      error('Popup blocked. Please allow popups to print shopping lists.');
      return;
    }

    const itemsHtml = (listToPrint.items || [])
      .map(
        (i, idx) => `
        <tr style="border-bottom: 1px solid #E5EAE6;">
          <td style="padding: 8px 6px;">${idx + 1}</td>
          <td style="padding: 8px 6px; font-weight: 600;">${i.name}</td>
          <td style="padding: 8px 6px;">${i.quantity} ${i.unit}</td>
          <td style="padding: 8px 6px; color: #718078;">${i.category}</td>
          <td style="padding: 8px 6px; color: #2E8B57; font-weight: 600;">✓ Purchased</td>
        </tr>
      `
      )
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${listToPrint.title} — Digitick Shopping List</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #24352B; }
            h1 { font-size: 22px; color: #1B5E3B; margin-bottom: 4px; }
            .meta { font-size: 12px; color: #718078; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
            th { border-bottom: 2px solid #2E8B57; padding: 8px 6px; font-weight: 700; color: #1B5E3B; }
            .footer { margin-top: 30px; font-size: 11px; color: #718078; text-align: center; }
          </style>
        </head>
        <body>
          <h1>${listToPrint.title}</h1>
          <div class="meta">
            Digitick Household Shopping List • Completed on ${new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(new Date(listToPrint.completed_at || listToPrint.updated_at || listToPrint.created_at))} • ${listToPrint.total_items} items
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 36px;">#</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Category</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div class="footer">Printed from Digitick — Smart Household Shopping Management Platform</div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleExportPDF = (listToExport: ShoppingList) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const items = listToExport.items || [];
      const completedDate = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full',
      }).format(
        new Date(
          listToExport.completed_at ||
            listToExport.updated_at ||
            listToExport.created_at
        )
      );

      // Forest green header banner
      doc.setFillColor(27, 94, 59); // #1B5E3B Forest Green
      doc.rect(0, 0, 210, 26, 'F');

      // Title and Brand
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text('DIGITICK', 14, 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(232, 245, 236); // #E8F5EC Soft Mint
      doc.text('Smart Household Shopping Management Platform', 14, 18);

      // Document Title & Meta
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(36, 53, 43); // #24352B Dark Text
      doc.text(listToExport.title, 14, 36);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(113, 128, 120); // #718078 Muted
      doc.text(
        `Completed: ${completedDate}   |   Total Items: ${items.length}   |   Status: Completed`,
        14,
        42
      );

      // Horizontal divider
      doc.setDrawColor(229, 234, 230); // #E5EAE6
      doc.setLineWidth(0.4);
      doc.line(14, 46, 196, 46);

      // Table Header
      let yPos = 54;
      doc.setFillColor(247, 250, 247); // #F7FAF7
      doc.rect(14, yPos - 5, 182, 8, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(27, 94, 59);
      doc.text('#', 17, yPos);
      doc.text('Product Name', 28, yPos);
      doc.text('Quantity', 105, yPos);
      doc.text('Category', 138, yPos);
      doc.text('Status', 174, yPos);

      doc.setDrawColor(46, 139, 87); // #2E8B57
      doc.setLineWidth(0.3);
      doc.line(14, yPos + 3, 196, yPos + 3);

      yPos += 9;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);

      items.forEach((item, index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(113, 128, 120);
        doc.text(String(index + 1), 17, yPos);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(36, 53, 43);
        doc.text(item.name.substring(0, 38), 28, yPos);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(36, 53, 43);
        doc.text(`${item.quantity} ${item.unit}`, 105, yPos);
        doc.text(item.category || 'Other', 138, yPos);

        doc.setTextColor(46, 139, 87);
        doc.text('✓ Done', 174, yPos);

        doc.setDrawColor(240, 243, 240);
        doc.setLineWidth(0.2);
        doc.line(14, yPos + 2.5, 196, yPos + 2.5);

        yPos += 7.5;
      });

      const pageCount = (doc.internal as any).getNumberOfPages();
      for (let p = 1; p <= pageCount; p++) {
        doc.setPage(p);
        doc.setFontSize(8);
        doc.setTextColor(150, 160, 155);
        doc.text(
          `Digitick Household Platform • Page ${p} of ${pageCount}`,
          105,
          288,
          { align: 'center' }
        );
      }

      const safeTitle = listToExport.title.toLowerCase().replace(/[^a-z0-9]+/g, '_');
      doc.save(`${safeTitle}_digitick.pdf`);
      success('PDF exported and downloaded!');
    } catch (err: any) {
      error('Failed to export PDF: ' + err.message);
    }
  };

  const filtered = lists.filter((l) =>
    l.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-fadeIn pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-1.5 text-nature-forest dark:text-darknature-highlight text-xs font-bold uppercase tracking-wider mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-nature-primary dark:text-darknature-primary" />
            <span>Shopping History</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-nature-forest dark:text-darknature-text tracking-tight">
            Completed Shopping Lists ({lists.length})
          </h2>
          <p className="text-xs text-nature-muted dark:text-darknature-muted mt-0.5">
            Past grocery runs, purchase records, and reusable household templates
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <Input
          placeholder="Search past completed lists..."
          icon={<Search className="w-4 h-4 text-nature-muted" />}
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
      </div>

      {/* Lists Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-6 h-6 border-2 border-nature-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((list) => {
            const completedDate = new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }).format(new Date(list.completed_at || list.updated_at || list.created_at));

            return (
              <div
                key={list.id}
                className="bg-nature-white dark:bg-darknature-card rounded-2xl p-4 border border-nature-border dark:border-darknature-border hover:border-nature-primary/50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-semibold text-nature-forest dark:text-darknature-highlight flex items-center gap-1 bg-nature-mint dark:bg-darknature-mint px-2 py-0.5 rounded-md border border-nature-border dark:border-darknature-border">
                      <CheckCircle2 className="w-3 h-3 text-nature-primary" /> Completed
                    </span>
                    <span className="text-[11px] text-nature-muted dark:text-darknature-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {completedDate}
                    </span>
                  </div>

                  <h3
                    onClick={() => handleOpenDetailModal(list.id)}
                    className="text-base font-bold text-nature-forest dark:text-darknature-text hover:text-nature-primary dark:hover:text-darknature-highlight cursor-pointer transition-colors mb-1 line-clamp-1"
                  >
                    {list.title}
                  </h3>

                  <p className="text-xs text-nature-muted dark:text-darknature-muted mb-3">
                    {list.total_items} {list.total_items === 1 ? 'product' : 'products'} purchased
                  </p>
                </div>

                {/* Card Actions */}
                <div className="pt-2.5 border-t border-nature-border dark:border-darknature-border flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenDetailModal(list.id)}
                    className="text-xs font-semibold text-nature-muted hover:text-nature-forest dark:hover:text-darknature-highlight flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Items</span>
                  </button>

                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Copy className="w-3.5 h-3.5" />}
                    onClick={() => handleReuse(list.id)}
                  >
                    Reuse List
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-10 text-center rounded-2xl bg-nature-white dark:bg-darknature-card border border-dashed border-nature-border dark:border-darknature-border">
          <Archive className="w-10 h-10 text-nature-muted dark:text-darknature-muted mx-auto mb-2" />
          <h4 className="text-sm font-bold text-nature-forest dark:text-darknature-text mb-1">
            {search ? 'No completed lists match your search' : 'No completed lists yet'}
          </h4>
          <p className="text-xs text-nature-muted max-w-sm mx-auto mb-4">
            When you complete an active shopping trip, it moves here so you can reuse, review, print or export it anytime.
          </p>
          <Button variant="outline" size="sm" onClick={() => navigate('/lists')}>
            Go to Active Lists
          </Button>
        </div>
      )}

      {/* Completed List Detail & Export Modal */}
      {selectedList && (
        <Modal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title={selectedList.title}
          description={`Completed on ${new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(selectedList.completed_at || selectedList.created_at))} • ${selectedList.total_items} items`}
          maxWidth="lg"
        >
          <div className="space-y-4 pt-1">
            {/* Action Bar */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-nature-offwhite dark:bg-darknature-sidebar border border-nature-border dark:border-darknature-border">
              <Button
                variant="primary"
                size="sm"
                icon={<Copy className="w-3.5 h-3.5" />}
                onClick={() => handleReuse(selectedList.id)}
              >
                Reuse into Active List
              </Button>

              <div className="flex items-center space-x-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Printer className="w-3.5 h-3.5" />}
                  onClick={() => handlePrint(selectedList)}
                >
                  Print
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Download className="w-3.5 h-3.5" />}
                  onClick={() => handleExportPDF(selectedList)}
                >
                  Export PDF
                </Button>
                <button
                  onClick={() => handleDelete(selectedList.id)}
                  className="p-1.5 rounded-lg text-nature-muted hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Delete list"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Items Table */}
            <div className="max-h-72 overflow-y-auto rounded-xl border border-nature-border dark:border-darknature-border">
              <table className="w-full text-left text-xs">
                <thead className="bg-nature-offwhite dark:bg-darknature-sidebar text-nature-forest dark:text-darknature-highlight font-semibold sticky top-0 border-b border-nature-border dark:border-darknature-border">
                  <tr>
                    <th className="p-2.5 pl-3">Product</th>
                    <th className="p-2.5">Qty</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5 text-right pr-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-nature-border/60 dark:divide-darknature-border/60">
                  {(selectedList.items || []).map((item) => (
                    <tr key={item.id} className="hover:bg-nature-offwhite/50 dark:hover:bg-darknature-sidebar/40">
                      <td className="p-2.5 pl-3 font-semibold text-nature-text dark:text-darknature-text">
                        {item.name}
                        {item.notes && (
                          <span className="block text-[10px] text-nature-muted font-normal">
                            {item.notes}
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 text-nature-muted dark:text-darknature-muted">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="p-2.5">
                        <Badge category={item.category} size="sm" />
                      </td>
                      <td className="p-2.5 text-right pr-3">
                        <span className="text-[11px] font-semibold text-nature-primary dark:text-darknature-highlight">
                          ✓ Purchased
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(!selectedList.items || selectedList.items.length === 0) && (
                    <tr>
                      <td colSpan={4} className="p-5 text-center text-nature-muted">
                        No item records attached to this list.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 border-t border-nature-border dark:border-darknature-border">
              <Button variant="outline" size="sm" onClick={() => setViewModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
