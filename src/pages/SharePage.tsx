import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { useActivityStore } from '../stores/activityStore';
import Template1 from '../components/templates/Template1';
import Template2 from '../components/templates/Template2';
import Template3 from '../components/templates/Template3';
import Template4 from '../components/templates/Template4';
import Template5 from '../components/templates/Template5';
import Template6 from '../components/templates/Template6';
import { Activity } from '../types';

const TEMPLATES = [
  { id: 1, label: 'Route Only', Component: Template1 },
  { id: 2, label: 'Route + Dist', Component: Template2 },
  { id: 3, label: 'Full Stats', Component: Template3 },
  { id: 4, label: 'Minimal', Component: Template4 },
  { id: 5, label: 'Poster', Component: Template5 },
  { id: 6, label: 'Dark', Component: Template6 },
];

export default function SharePage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { activities, fetchActivityById } = useActivityStore();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(1);
  const [capturing, setCapturing] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadActivity = async () => {
      setLoading(true);
      const found = activities.find((a) => a.id === id);
      if (found) {
        setActivity(found);
      } else {
        const fetched = await fetchActivityById(id!);
        setActivity(fetched);
      }
      setLoading(false);
    };

    if (id) loadActivity();
  }, [id, activities, fetchActivityById]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-brand text-2xl">⚡</div>
    </div>
  );

  if (!activity) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-[#333] text-sm">Activity not found.</p>
    </div>
  );

  const ActiveTemplate = TEMPLATES.find((t) => t.id === selected)!.Component;

  const capture = async (): Promise<string | null> => {
    if (!canvasRef.current) return null;
    const canvas = await html2canvas(canvasRef.current, {
      backgroundColor: null, scale: 2, useCORS: true,
    });
    return canvas.toDataURL('image/png');
  };

  const handleSave = async () => {
    setCapturing(true);
    const dataUrl = await capture();
    if (dataUrl) {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `celerfast-${id}.png`;
      a.click();
    }
    setCapturing(false);
  };

  const handleShare = async () => {
    setCapturing(true);
    const dataUrl = await capture();
    if (!dataUrl) { setCapturing(false); return; }
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], 'activity.png', { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: 'My Activity — CelerFast' });
    } else {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `celerfast-${id}.png`;
      a.click();
    }
    setCapturing(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center gap-3 p-4 border-b border-[#1a1a1a]">
        <button onClick={() => nav(-1)} className="text-brand">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>
        <h1 className="text-base font-bold uppercase tracking-widest">Share Image</h1>
      </div>

      <div className="flex gap-2 p-4 overflow-x-auto">
        {TEMPLATES.map((t) => (
          <button key={t.id} onClick={() => setSelected(t.id)}
            className={`shrink-0 px-4 py-2 text-xs font-semibold border uppercase tracking-widest transition-colors ${
              selected === t.id ? 'bg-brand text-black border-brand' : 'border-[#222] text-[#444]'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-4">
        <div className="border border-[#1a1a1a] overflow-hidden">
          <div ref={canvasRef} style={{ background: 'transparent' }}>
            <ActiveTemplate activity={activity} />
          </div>
        </div>
      </div>

      <div className="flex gap-3 p-4">
        <button onClick={handleSave} disabled={capturing}
          className="flex-1 border border-[#222] text-white font-semibold py-4 text-sm tracking-widest uppercase disabled:opacity-50">
          Save PNG
        </button>
        <button onClick={handleShare} disabled={capturing}
          className="flex-1 bg-brand text-black font-bold py-4 text-sm tracking-widest uppercase disabled:opacity-50">
          Share
        </button>
      </div>
    </div>
  );
}
