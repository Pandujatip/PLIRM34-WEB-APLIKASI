#!/usr/bin/env python3
"""
Local Equipment Explorer: Web GUI Ringan untuk Penelusuran Database Master Equipment SAP (Tuban 1 - 4)
Menyediakan antarmuka visual responsif, filter Pabrik & Area Operasional, pencarian kilat, pohon hierarki interaktif, dan ekspor data.
"""

import sys
import os
import sqlite3
import json
import csv
import io
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
from http import HTTPStatus

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "sap_equipment.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

HTML_CONTENT = """<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maintenance Tool Online - SAP Equipment Explorer</title>
    <style>
        :root {
            --bg-dark: #0B1118;
            --bg-card: #152233;
            --bg-card-hover: #1E2F46;
            --border: #2D3E53;
            --text-primary: #F1F5F9;
            --text-secondary: #94A3B8;
            --cyan: #00E5FF;
            --teal: #00E676;
            --amber: #FBBF24;
            --purple: #C084FC;
            --blue: #60A5FA;
            --rose: #F43F5E;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg-dark);
            color: var(--text-primary);
            line-height: 1.5;
            padding-bottom: 40px;
        }
        .header {
            background: linear-gradient(135deg, #102235 0%, #0B1118 100%);
            border-bottom: 1px solid var(--border);
            padding: 20px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
        }
        .header h1 { font-size: 22px; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 10px; }
        .header h1 span { color: var(--cyan); }
        .header p { font-size: 13px; color: var(--text-secondary); margin-top: 4px; }
        .badge-live {
            background: rgba(0, 230, 118, 0.15);
            color: var(--teal);
            border: 1px solid var(--teal);
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .badge-live::before {
            content: '';
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--teal);
            box-shadow: 0 0 8px var(--teal);
        }

        .stats-bar {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 12px;
            padding: 16px 24px;
            background: #0E1722;
            border-bottom: 1px solid var(--border);
        }
        .stat-card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 12px 16px;
        }
        .stat-label { font-size: 11px; text-transform: uppercase; color: var(--text-secondary); font-weight: 600; }
        .stat-val { font-size: 20px; font-weight: 800; color: #fff; margin-top: 4px; }
        .stat-sub { font-size: 11px; color: var(--cyan); margin-top: 2px; }

        .container {
            max-width: 1560px;
            margin: 20px auto;
            padding: 0 24px;
        }

        /* Filter Controls */
        .controls {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 20px;
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            align-items: center;
        }
        .search-box {
            flex: 2;
            min-width: 260px;
            position: relative;
        }
        .search-input {
            width: 100%;
            padding: 10px 14px 10px 36px;
            background: #0B1118;
            border: 1px solid var(--border);
            border-radius: 8px;
            color: #fff;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s;
        }
        .search-input:focus { border-color: var(--cyan); }
        .search-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-secondary);
        }
        .select-filter {
            padding: 10px 12px;
            background: #0B1118;
            border: 1px solid var(--border);
            border-radius: 8px;
            color: #fff;
            font-size: 13px;
            outline: none;
            cursor: pointer;
            min-width: 150px;
        }
        .select-filter:focus { border-color: var(--cyan); }
        .btn-export {
            background: rgba(0, 229, 255, 0.15);
            border: 1px solid var(--cyan);
            color: var(--cyan);
            font-weight: 600;
            padding: 10px 16px;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            transition: all 0.2s;
            margin-left: auto;
        }
        .btn-export:hover {
            background: var(--cyan);
            color: #000;
        }

        /* Layout */
        .grid-layout {
            display: grid;
            grid-template-columns: 1fr 490px;
            gap: 20px;
        }
        @media (max-width: 1100px) {
            .grid-layout { grid-template-columns: 1fr; }
        }

        /* Results Table Card */
        .table-card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 12px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        .table-header {
            padding: 14px 20px;
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            color: var(--text-secondary);
        }
        .table-responsive {
            overflow-x: auto;
            max-height: 700px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
            text-align: left;
        }
        th {
            background: #0E1722;
            padding: 12px 14px;
            font-weight: 600;
            color: var(--text-secondary);
            border-bottom: 1px solid var(--border);
            position: sticky;
            top: 0;
            z-index: 2;
        }
        td {
            padding: 12px 14px;
            border-bottom: 1px solid rgba(45, 62, 83, 0.5);
            color: #CBD5E1;
        }
        tr:hover td {
            background: var(--bg-card-hover);
            cursor: pointer;
        }
        tr.active-row td {
            background: rgba(0, 229, 255, 0.12);
            color: #fff;
        }

        /* Badges */
        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
        }
        .badge-plant { background: #1E293B; color: #94A3B8; border: 1px solid #334155; }
        .badge-area  { background: rgba(96, 165, 250, 0.15); color: #93C5FD; border: 1px solid rgba(96, 165, 250, 0.3); }
        .badge-elec  { background: rgba(0, 229, 255, 0.15); color: var(--cyan); }
        .badge-mech  { background: rgba(0, 230, 118, 0.15); color: var(--teal); }
        .badge-inst  { background: rgba(192, 132, 252, 0.15); color: var(--purple); }
        .badge-civ   { background: rgba(251, 191, 36, 0.15); color: var(--amber); }
        .badge-main  { background: rgba(0, 229, 255, 0.2); color: var(--cyan); font-weight: 700; }
        .badge-sub   { background: #1E293B; color: #94A3B8; }

        /* Tree Panel */
        .tree-card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            position: sticky;
            top: 20px;
            max-height: 800px;
            overflow-y: auto;
        }
        .tree-header {
            padding-bottom: 14px;
            border-bottom: 1px solid var(--border);
            margin-bottom: 16px;
        }
        .tree-title { font-size: 16px; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px; }
        .tree-sub { font-size: 12px; color: var(--text-secondary); margin-top: 4px; }
        .tree-node {
            margin-left: 18px;
            padding: 6px 0;
            border-left: 1px dashed var(--border);
            position: relative;
        }
        .tree-node::before {
            content: '';
            position: absolute;
            top: 18px;
            left: 0;
            width: 14px;
            height: 1px;
            border-top: 1px dashed var(--border);
        }
        .tree-item {
            margin-left: 18px;
            padding: 8px 12px;
            border-radius: 6px;
            background: #0E1722;
            border: 1px solid var(--border);
            cursor: pointer;
            transition: all 0.15s;
        }
        .tree-item:hover {
            border-color: var(--cyan);
            background: #152233;
        }
        .tree-item.current-item {
            border-color: var(--cyan);
            background: rgba(0, 229, 255, 0.15);
            box-shadow: 0 0 10px rgba(0, 229, 255, 0.2);
        }
        .tree-item-title {
            font-size: 13px;
            font-weight: 700;
            color: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .tree-item-desc {
            font-size: 12px;
            color: var(--text-secondary);
            margin-top: 2px;
        }
        .pagination {
            padding: 12px 20px;
            border-top: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #0E1722;
        }
        .btn-page {
            background: var(--bg-card);
            border: 1px solid var(--border);
            color: #fff;
            padding: 6px 14px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
        }
        .btn-page:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }
    </style>
</head>
<body>

<div class="header">
    <div>
        <h1><span>Maintenance Tool Online</span> &bull; Master Equipment SAP Explorer</h1>
        <p>Database Komprehensif Pabrik Tuban 1 - 4 (SG-2302 s/d SG-2305) &bull; Dikelompokkan Berdasarkan Unit Pabrik & Area Operasional</p>
    </div>
    <div class="badge-live">DATABASE LOKAL AKTIF</div>
</div>

<div class="stats-bar">
    <div class="stat-card">
        <div class="stat-label">Total Unit Pabrik</div>
        <div class="stat-val" id="statPlants">4</div>
        <div class="stat-sub">Tuban 1 s/d Tuban 4</div>
    </div>
    <div class="stat-card">
        <div class="stat-label">Area Operasional</div>
        <div class="stat-val" id="statAreas">29 Area</div>
        <div class="stat-sub">Crusher, Kiln, Raw Mill, dll</div>
    </div>
    <div class="stat-card">
        <div class="stat-label">Total Equipment</div>
        <div class="stat-val" id="statEquipments">-</div>
        <div class="stat-sub" id="statMainSub">-</div>
    </div>
    <div class="stat-card">
        <div class="stat-label">Functional Location</div>
        <div class="stat-val" id="statFloc">-</div>
        <div class="stat-sub">Grup Mesin & Fasilitas</div>
    </div>
    <div class="stat-card">
        <div class="stat-label">Mechanical (M)</div>
        <div class="stat-val" id="statMech">-</div>
        <div class="stat-sub">Peralatan Mekanikal</div>
    </div>
    <div class="stat-card">
        <div class="stat-label">Electrical (E)</div>
        <div class="stat-val" id="statElec">-</div>
        <div class="stat-sub">Motor & Panel Listrik</div>
    </div>
</div>

<div class="container">
    <div class="controls">
        <div class="search-box">
            <span class="search-icon">🔍</span>
            <input type="text" id="searchInput" class="search-input" placeholder="Cari No Alat (50015855), Tag (231BF1), Mesin, atau Floc...">
        </div>
        <select id="plantSelect" class="select-filter" onchange="onPlantChange()">
            <option value="ALL">Semua Pabrik (Tuban 1-4)</option>
            <option value="SG-2302">Plant Tuban 1 (SG-2302)</option>
            <option value="SG-2303">Plant Tuban 2 (SG-2303)</option>
            <option value="SG-2304">Plant Tuban 3 (SG-2304)</option>
            <option value="SG-2305">Plant Tuban 4 (SG-2305)</option>
        </select>
        <select id="areaSelect" class="select-filter" onchange="triggerSearch()">
            <option value="ALL">Semua Area Operasional</option>
        </select>
        <select id="disciplineSelect" class="select-filter" onchange="triggerSearch()">
            <option value="ALL">Semua Disiplin</option>
            <option value="Electrical">Electrical (E)</option>
            <option value="Mechanical">Mechanical (M)</option>
            <option value="Instrumentation">Instrumentation (I)</option>
            <option value="Utility / Lubrication">Utility / Lube (U)</option>
            <option value="Civil">Civil (C)</option>
        </select>
        <select id="typeSelect" class="select-filter" onchange="triggerSearch()">
            <option value="ALL">Semua Tipe (Main & Sub)</option>
            <option value="1">Hanya Main Equipment</option>
            <option value="0">Hanya Sub-Equipment</option>
        </select>
        <button class="btn-export" onclick="exportCsv()">
            📥 Ekspor CSV
        </button>
    </div>

    <div class="grid-layout">
        <!-- Table Column -->
        <div class="table-card">
            <div class="table-header">
                <div>Menampilkan <strong id="resultCount" style="color: #fff;">0</strong> equipment</div>
                <div id="filterIndicator">Filter: All Plants &bull; All Areas</div>
            </div>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>No Equipment</th>
                            <th>Tag / No Func Loc</th>
                            <th>Deskripsi Alat</th>
                            <th>Disiplin</th>
                            <th>Pabrik</th>
                            <th>Area</th>
                            <th>Tipe</th>
                        </tr>
                    </thead>
                    <tbody id="tableBody">
                        <tr><td colspan="7" style="text-align: center; padding: 40px; color: #94A3B8;">Memuat data master equipment...</td></tr>
                    </tbody>
                </table>
            </div>
            <div class="pagination">
                <button id="btnPrev" class="btn-page" onclick="changePage(-1)">← Sebelumnya</button>
                <span id="pageInfo" style="font-size: 12px; color: #94A3B8;">Halaman 1</span>
                <button id="btnNext" class="btn-page" onclick="changePage(1)">Selanjutnya →</button>
            </div>
        </div>

        <!-- Tree Column -->
        <div class="tree-card" id="treePanel">
            <div class="tree-header">
                <div class="tree-title">🌳 Pohon Hierarki Equipment</div>
                <div class="tree-sub" id="treeSub">Klik salah satu baris equipment di sebelah kiri untuk melihat hierarki lengkap.</div>
            </div>
            <div id="treeContainer">
                <p style="color: #64748B; font-size: 13px; text-align: center; margin-top: 40px;">
                    Pilih baris equipment untuk menelusuri induk (Parent), anak (Sub-Equipment), Area operasional, dan Functional Location.
                </p>
            </div>
        </div>
    </div>
</div>

<script>
let currentPage = 1;
const pageSize = 50;
let totalRecords = 0;
let currentSelectedId = null;
let searchDebounceTimer = null;

async function loadStats() {
    try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        document.getElementById('statPlants').innerText = data.plants;
        document.getElementById('statAreas').innerText = (data.total_areas || 29) + ' Area';
        document.getElementById('statEquipments').innerText = Number(data.total_equipments).toLocaleString();
        document.getElementById('statMainSub').innerText = `${Number(data.main_equipments).toLocaleString()} Main | ${Number(data.sub_equipments).toLocaleString()} Sub`;
        document.getElementById('statFloc').innerText = Number(data.total_flocs).toLocaleString();
        if (data.disciplines) {
            document.getElementById('statElec').innerText = Number(data.disciplines['Electrical'] || 0).toLocaleString();
            document.getElementById('statMech').innerText = Number(data.disciplines['Mechanical'] || 0).toLocaleString();
        }
    } catch (e) {
        console.error("Failed to load stats", e);
    }
}

async function loadAreas(plant = 'ALL') {
    try {
        const res = await fetch(`/api/areas?plant=${encodeURIComponent(plant)}`);
        const data = await res.json();
        const areaSelect = document.getElementById('areaSelect');
        const currentVal = areaSelect.value;
        
        let html = '<option value="ALL">Semua Area Operasional</option>';
        (data.areas || []).forEach(a => {
            const shortCode = a.area_code.replace(/^SG-230\d-/, '');
            const cleanName = a.area_name.replace(/TUBAN \d/i, '').replace(/AREA /i, '').trim();
            html += `<option value="${a.area_code}">${shortCode} - ${cleanName} (${a.equipment_count.toLocaleString()} eq)</option>`;
        });
        areaSelect.innerHTML = html;
        if (plant !== 'ALL' && areaSelect.querySelector(`option[value="${currentVal}"]`)) {
            areaSelect.value = currentVal;
        } else {
            areaSelect.value = 'ALL';
        }
    } catch (e) {
        console.error("Failed to load areas", e);
    }
}

function onPlantChange() {
    const plant = document.getElementById('plantSelect').value;
    loadAreas(plant).then(() => {
        triggerSearch();
    });
}

async function loadData() {
    const q = document.getElementById('searchInput').value.trim();
    const plant = document.getElementById('plantSelect').value;
    const area = document.getElementById('areaSelect').value;
    const discipline = document.getElementById('disciplineSelect').value;
    const isMain = document.getElementById('typeSelect').value;
    
    const offset = (currentPage - 1) * pageSize;
    const params = new URLSearchParams({
        q: q,
        plant: plant,
        area: area,
        discipline: discipline,
        is_main: isMain,
        limit: pageSize,
        offset: offset
    });

    try {
        const res = await fetch(`/api/search?${params.toString()}`);
        const data = await res.json();
        totalRecords = data.total;
        renderTable(data.records);
        updatePagination();
        
        // Update indicator
        let indText = `Pabrik: ${plant === 'ALL' ? 'Semua' : plant}`;
        if (area !== 'ALL') indText += ` | Area: ${area}`;
        if (discipline !== 'ALL') indText += ` | Disiplin: ${discipline}`;
        document.getElementById('filterIndicator').innerText = indText;
    } catch (e) {
        console.error("Search failed", e);
    }
}

function renderTable(records) {
    const tbody = document.getElementById('tableBody');
    document.getElementById('resultCount').innerText = Number(totalRecords).toLocaleString();
    
    if (!records || records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px; color: #94A3B8;">Tidak ada data yang cocok dengan kriteria pencarian.</td></tr>';
        return;
    }

    let html = '';
    records.forEach(r => {
        const discClass = getDisciplineClass(r.discipline_name);
        const pName = (r.plant_name || '').replace('PLANT ', '');
        const areaLabel = formatAreaBadge(r.area_code, r.area_name);
        const mainBadge = r.is_main_equipment 
            ? `<span class="badge badge-main">MAIN (${r.sub_equipment_count || 0})</span>` 
            : `<span class="badge badge-sub">SUB</span>`;
        const activeClass = (r.equipment_id === currentSelectedId) ? 'active-row' : '';

        html += `
        <tr class="${activeClass}" onclick="selectEquipment('${r.equipment_id}')">
            <td><strong>${r.equipment_id}</strong></td>
            <td><code style="color: var(--cyan);">${r.tag_no || '-'}</code></td>
            <td>${escapeHtml(r.description)}</td>
            <td><span class="badge ${discClass}">${r.discipline_name || '-'}</span></td>
            <td><span class="badge badge-plant">${pName}</span></td>
            <td>${areaLabel}</td>
            <td>${mainBadge}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

function formatAreaBadge(areaCode, areaName) {
    if (!areaCode) return '<span style="color: #64748B;">-</span>';
    const code = areaCode.replace(/^SG-230\d-/, '');
    const cleanName = (areaName || '').replace(/TUBAN \d/i, '').replace(/AREA /i, '').trim();
    return `<span class="badge badge-area" title="${escapeHtml(areaName || areaCode)}">${code} &bull; ${cleanName}</span>`;
}

function getDisciplineClass(disc) {
    if (!disc) return 'badge-sub';
    if (disc.includes('Electrical')) return 'badge-elec';
    if (disc.includes('Mechanical')) return 'badge-mech';
    if (disc.includes('Instrumentation')) return 'badge-inst';
    if (disc.includes('Civil')) return 'badge-civ';
    return 'badge-sub';
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function selectEquipment(eqId) {
    currentSelectedId = eqId;
    document.querySelectorAll('tr').forEach(tr => tr.classList.remove('active-row'));
    event.currentTarget?.classList?.add('active-row');

    const container = document.getElementById('treeContainer');
    container.innerHTML = '<p style="color: #94A3B8; text-align: center; padding: 20px;">Memuat pohon hierarki...</p>';

    try {
        const res = await fetch(`/api/tree?id=${eqId}`);
        const data = await res.json();
        renderTree(data);
    } catch (e) {
        container.innerHTML = `<p style="color: #EF4444;">Gagal memuat hierarki: ${e}</p>`;
    }
}

function renderTree(data) {
    const container = document.getElementById('treeContainer');
    const sub = document.getElementById('treeSub');
    
    if (data.error) {
        container.innerHTML = `<p style="color: #EF4444;">${data.error}</p>`;
        return;
    }

    sub.innerText = `${data.plant_name} | ${data.floc_code} (${data.floc_desc || '-'})`;

    let html = '';
    // Functional Location Info Box
    html += `
    <div style="background: #0B1118; border: 1px solid var(--border); border-radius: 8px; padding: 12px; margin-bottom: 14px; font-size: 12px;">
        <div style="color: var(--text-secondary);">Lokasi Pabrik & Area Operasional:</div>
        <div style="color: #fff; font-weight: 700; margin-top: 2px;">${data.plant_name} &bull; ${data.area_name || data.area_code || '-'}</div>
        <div style="color: var(--cyan); margin-top: 4px;">Floc: <code>${data.floc_code}</code> &bull; ${data.floc_desc || '-'}</div>
    </div>`;

    // Render tree nodes recursively
    function renderNode(node) {
        if (!node) return '';
        const isCurrent = (node.equipment_id === data.target_id);
        const currentClass = isCurrent ? 'current-item' : '';
        const badge = node.is_main_equipment 
            ? `<span class="badge badge-main" style="font-size:10px;">MAIN</span>` 
            : `<span class="badge badge-sub" style="font-size:10px;">SUB</span>`;
        
        let nodeHtml = `
        <div class="tree-item ${currentClass}" onclick="selectEquipment('${node.equipment_id}')">
            <div class="tree-item-title">
                <span><strong>${node.equipment_id}</strong> &bull; <code style="color: var(--cyan);">${node.tag_no || '-'}</code></span>
                ${badge}
            </div>
            <div class="tree-item-desc">${escapeHtml(node.description)}</div>
            <div style="font-size: 11px; color: #64748B; margin-top: 2px;">
                ${node.discipline_name || '-'} ${node.category ? '&bull; ' + node.category : ''}
            </div>
        </div>`;

        if (node.children && node.children.length > 0) {
            nodeHtml += `<div class="tree-node">`;
            node.children.forEach(c => {
                nodeHtml += renderNode(c);
            });
            nodeHtml += `</div>`;
        }
        return nodeHtml;
    }

    html += renderNode(data.root);
    container.innerHTML = html;
}

function updatePagination() {
    const totalPages = Math.ceil(totalRecords / pageSize) || 1;
    document.getElementById('pageInfo').innerText = `Halaman ${currentPage} dari ${totalPages.toLocaleString()} (${totalRecords.toLocaleString()} data)`;
    document.getElementById('btnPrev').disabled = (currentPage <= 1);
    document.getElementById('btnNext').disabled = (currentPage >= totalPages);
}

function changePage(delta) {
    const totalPages = Math.ceil(totalRecords / pageSize) || 1;
    const newPage = currentPage + delta;
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        loadData();
    }
}

function triggerSearch() {
    currentPage = 1;
    loadData();
}

function exportCsv() {
    const q = document.getElementById('searchInput').value.trim();
    const plant = document.getElementById('plantSelect').value;
    const area = document.getElementById('areaSelect').value;
    const discipline = document.getElementById('disciplineSelect').value;
    const isMain = document.getElementById('typeSelect').value;
    
    const params = new URLSearchParams({
        q: q,
        plant: plant,
        area: area,
        discipline: discipline,
        is_main: isMain
    });
    window.location.href = `/api/export?${params.toString()}`;
}

// Search debounce
document.getElementById('searchInput').addEventListener('input', () => {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
        triggerSearch();
    }, 300);
});

// Init on load
window.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadAreas('ALL');
    loadData();
});
</script>

</body>
</html>
"""

class EquipmentExplorerHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        # Mute normal HTTP log spam in console
        pass

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        if path == "/" or path == "/index.html":
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(HTML_CONTENT.encode("utf-8"))
            return

        elif path == "/api/stats":
            self._handle_stats()
            return

        elif path == "/api/areas":
            self._handle_areas(query)
            return

        elif path == "/api/search":
            self._handle_search(query)
            return

        elif path == "/api/tree":
            self._handle_tree(query)
            return

        elif path == "/api/export":
            self._handle_export(query)
            return

        self.send_error(HTTPStatus.NOT_FOUND, "Not Found")

    def _handle_stats(self):
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT count(*) FROM plants")
        num_plants = cur.fetchone()[0]
        cur.execute("SELECT count(*) FROM areas")
        num_areas = cur.fetchone()[0]
        cur.execute("SELECT count(*) FROM functional_locations")
        num_floc = cur.fetchone()[0]
        cur.execute("SELECT count(*), sum(is_main_equipment), count(*) - sum(is_main_equipment) FROM equipments")
        tot_eq, main_eq, sub_eq = cur.fetchone()

        cur.execute("SELECT discipline_name, count(*) FROM equipments GROUP BY discipline_name")
        disc_map = {row[0]: row[1] for row in cur.fetchall() if row[0]}
        conn.close()

        payload = {
            "plants": num_plants,
            "total_areas": num_areas,
            "total_flocs": num_floc,
            "total_equipments": tot_eq,
            "main_equipments": main_eq,
            "sub_equipments": sub_eq,
            "disciplines": disc_map
        }
        self._send_json(payload)

    def _handle_areas(self, query):
        plant = query.get("plant", ["ALL"])[0].strip()
        conn = get_db()
        cur = conn.cursor()
        if plant != "ALL":
            cur.execute("SELECT area_code, area_name, plant_code, equipment_count, main_equipment_count FROM areas WHERE plant_code = ? ORDER BY area_code", (plant,))
        else:
            cur.execute("SELECT area_code, area_name, plant_code, equipment_count, main_equipment_count FROM areas ORDER BY plant_code, area_code")
        rows = [dict(r) for r in cur.fetchall()]
        conn.close()
        self._send_json({"areas": rows})

    def _handle_search(self, query):
        q = query.get("q", [""])[0].strip()
        plant = query.get("plant", ["ALL"])[0].strip()
        area = query.get("area", ["ALL"])[0].strip()
        disc = query.get("discipline", ["ALL"])[0].strip()
        is_main = query.get("is_main", ["ALL"])[0].strip()
        limit = int(query.get("limit", [50])[0])
        offset = int(query.get("offset", [0])[0])

        conn = get_db()
        cur = conn.cursor()

        where_clauses = []
        params = []

        if plant != "ALL":
            where_clauses.append("plant_code = ?")
            params.append(plant)

        if area != "ALL":
            where_clauses.append("area_code = ?")
            params.append(area)

        if disc != "ALL":
            where_clauses.append("discipline_name = ?")
            params.append(disc)

        if is_main in ("0", "1"):
            where_clauses.append("is_main_equipment = ?")
            params.append(int(is_main))

        # Search term handling
        if q:
            fts_term = q.replace('"', '""') + "*"
            try:
                cur.execute("SELECT rowid FROM equipment_fts WHERE equipment_fts MATCH ? LIMIT 500", (fts_term,))
                rowids = [r[0] for r in cur.fetchall()]
                if rowids:
                    placeholders = ",".join("?" for _ in rowids)
                    where_clauses.append(f"rowid IN ({placeholders})")
                    params.extend(rowids)
                else:
                    like_str = f"%{q}%"
                    where_clauses.append("(equipment_id LIKE ? OR tag_no LIKE ? OR description LIKE ? OR floc_code LIKE ?)")
                    params.extend([like_str, like_str, like_str, like_str])
            except Exception:
                like_str = f"%{q}%"
                where_clauses.append("(equipment_id LIKE ? OR tag_no LIKE ? OR description LIKE ? OR floc_code LIKE ?)")
                params.extend([like_str, like_str, like_str, like_str])

        where_str = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""

        # Count total
        cur.execute(f"SELECT count(*) FROM equipments {where_str}", params)
        total = cur.fetchone()[0]

        # Fetch records
        cur.execute(f"""
            SELECT equipment_id, tag_no, description, discipline_name, plant_name, area_code, area_name, is_main_equipment, sub_equipment_count, floc_code
            FROM equipments
            {where_str}
            ORDER BY plant_code, level, equipment_id
            LIMIT ? OFFSET ?
        """, params + [limit, offset])

        records = [dict(r) for r in cur.fetchall()]
        conn.close()

        self._send_json({"total": total, "records": records})

    def _handle_tree(self, query):
        eq_id = query.get("id", [""])[0].strip()
        if not eq_id:
            self._send_json({"error": "Parameter id wajib diisi"})
            return

        conn = get_db()
        cur = conn.cursor()

        cur.execute("SELECT * FROM equipments WHERE equipment_id = ? OR tag_no = ? LIMIT 1", (eq_id, eq_id))
        target = cur.fetchone()
        if not target:
            self._send_json({"error": f"Equipment '{eq_id}' tidak ditemukan"})
            conn.close()
            return

        # Find root
        root = target
        visited = set()
        while root["parent_equipment_id"] and root["equipment_id"] not in visited:
            visited.add(root["equipment_id"])
            cur.execute("SELECT * FROM equipments WHERE equipment_id = ?", (root["parent_equipment_id"],))
            p = cur.fetchone()
            if not p:
                break
            root = p

        # Functional location info
        floc_desc = ""
        area_code = root["area_code"] or ""
        area_name = root["area_name"] or ""
        group_area_code = ""
        if root["floc_code"]:
            cur.execute("SELECT description, area_code, group_area_code FROM functional_locations WHERE floc_code = ?", (root["floc_code"],))
            floc_row = cur.fetchone()
            if floc_row:
                floc_desc = floc_row["description"]
                if not area_code:
                    area_code = floc_row["area_code"]
                group_area_code = floc_row["group_area_code"]

        if area_code and not area_name:
            cur.execute("SELECT area_name FROM areas WHERE area_code = ?", (area_code,))
            arow = cur.fetchone()
            if arow:
                area_name = arow["area_name"]

        def build_tree_dict(current_id):
            cur.execute("SELECT * FROM equipments WHERE equipment_id = ?", (current_id,))
            n = cur.fetchone()
            if not n:
                return None
            res = dict(n)
            cur.execute("SELECT equipment_id FROM equipments WHERE parent_equipment_id = ? ORDER BY equipment_id", (current_id,))
            children_ids = [r[0] for r in cur.fetchall()]
            res["children"] = [build_tree_dict(cid) for cid in children_ids]
            return res

        tree_data = {
            "plant_code": root["plant_code"],
            "plant_name": root["plant_name"],
            "floc_code": root["floc_code"],
            "floc_desc": floc_desc,
            "area_code": area_code,
            "area_name": area_name,
            "group_area_code": group_area_code,
            "target_id": target["equipment_id"],
            "root": build_tree_dict(root["equipment_id"])
        }
        conn.close()
        self._send_json(tree_data)

    def _handle_export(self, query):
        q = query.get("q", [""])[0].strip()
        plant = query.get("plant", ["ALL"])[0].strip()
        area = query.get("area", ["ALL"])[0].strip()
        disc = query.get("discipline", ["ALL"])[0].strip()
        is_main = query.get("is_main", ["ALL"])[0].strip()

        conn = get_db()
        cur = conn.cursor()

        where_clauses = []
        params = []
        if plant != "ALL":
            where_clauses.append("plant_code = ?")
            params.append(plant)
        if area != "ALL":
            where_clauses.append("area_code = ?")
            params.append(area)
        if disc != "ALL":
            where_clauses.append("discipline_name = ?")
            params.append(disc)
        if is_main in ("0", "1"):
            where_clauses.append("is_main_equipment = ?")
            params.append(int(is_main))
        if q:
            like_str = f"%{q}%"
            where_clauses.append("(equipment_id LIKE ? OR tag_no LIKE ? OR description LIKE ?)")
            params.extend([like_str, like_str, like_str])

        where_str = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""
        cur.execute(f"SELECT equipment_id, tag_no, description, discipline_name, category, plant_code, plant_name, area_code, area_name, floc_code, parent_equipment_id, is_main_equipment FROM equipments {where_str} ORDER BY plant_code, level, equipment_id LIMIT 10000", params)
        rows = cur.fetchall()

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Equipment ID", "Tag / Func Loc", "Deskripsi", "Disiplin", "Kategori", "Plant Code", "Plant Name", "Area Code", "Area Name", "Floc Code", "Parent Equipment ID", "Is Main Equipment"])
        for r in rows:
            writer.writerow(list(r))
        conn.close()

        csv_bytes = output.getvalue().encode("utf-8-sig")
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "text/csv; charset=utf-8")
        self.send_header("Content-Disposition", 'attachment; filename="sap_equipment_export.csv"')
        self.send_header("Content-Length", str(len(csv_bytes)))
        self.end_headers()
        self.wfile.write(csv_bytes)

    def _send_json(self, data):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

def run_server(port=8020):
    server_address = ("127.0.0.1", port)
    httpd = HTTPServer(server_address, EquipmentExplorerHandler)
    print("=" * 60)
    print(f"LOCAL EQUIPMENT EXPLORER AKTIF!")
    print(f"Buka di Browser Anda : http://127.0.0.1:{port}")
    print(f"Database Terhubung   : {DB_PATH}")
    print("Tekan Ctrl+C untuk menghentikan server.")
    print("=" * 60)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer dimatikan.")

if __name__ == "__main__":
    port = 8020
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        port = int(sys.argv[1])
    run_server(port)
