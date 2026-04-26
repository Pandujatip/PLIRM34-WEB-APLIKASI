function renderServiceCard(item) {
  serviceItemCache.set(item.id, {
    ...item,
    payload: item.payload || {},
  });
  const isMsoMotorItem = (item.formType === "service-motor-mv" || item.formType === "service-motor-mso") && String(item.payload?.source || "").toUpperCase() === "MSO";
  const canDeleteService = activeRole !== "team";
  const card = document.createElement("article");
  card.className = "service-list-item";
  card.dataset.openable = "true";
  card.tabIndex = 0;
  card.dataset.id = item.id;
  card.dataset.type = item.type;
  card.dataset.subtype = item.subtype || item.type;
  card.dataset.formType = item.formType || "";
  card.dataset.equipmentName = item.equipmentName || "";
  card.dataset.description = item.description || "";
  card.dataset.detail = item.detail || "";

  const carbonBrushStatsPayload = item.formType === "service-motor-mv-carbon-brush"
    ? (item.payload?.stats || computeCarbonBrushStats(item.payload?.measurements || {}, item.equipmentName || "", item.payload?.plant || ""))
    : null;
  const inspectionDate = formatInspectionDate(item.payload?.inspectionDate);
  const msoMaxVibration = isMsoMotorItem
    ? [
      item.payload?.vibrasiDsVertBefore,
      item.payload?.vibrasiDsHorBefore,
      item.payload?.vibrasiDsAxialBefore,
      item.payload?.vibrasiNdsVertBefore,
      item.payload?.vibrasiNdsHorBefore,
      item.payload?.vibrasiNdsAxialBefore,
    ]
      .map((value) => Number.parseFloat(String(value || "").replace(",", ".")))
      .filter((value) => Number.isFinite(value))
      .sort((left, right) => right - left)[0]
    : null;
  const summaryText = item.formType === "service-motor-mv-carbon-brush"
    ? `Merah ${carbonBrushStatsPayload?.low || 0} | Kuning ${carbonBrushStatsPayload?.medium || 0} | Hijau ${carbonBrushStatsPayload?.high || 0}`
    : (isMsoMotorItem
      ? `Condition ${item.payload?.condition || "-"} | Temp DS ${item.payload?.temperaturDs || "-"} | Temp NDS ${item.payload?.temperaturNds || "-"} | Vib max ${msoMaxVibration ?? "-"}`
      : (item.detail || "-"));

  card.innerHTML = `
    <div class="service-list-main">
      <div class="service-list-top">
        <span class="tag ${getServiceTag(item.type)}">${item.subtype || item.type}</span>
        <small>${inspectionDate}</small>
      </div>
      <strong>${item.equipmentName}</strong>
      <div class="service-list-meta">
        <span>${summaryText}</span>
      </div>
    </div>
    <div class="service-list-actions">
      <button class="table-action compact" data-action="send-service" type="button">Kirim</button>
      ${isMsoMotorItem ? '<span class="table-action compact muted-action" title="Data sinkron dari MSO">MSO</span>' : '<button class="table-action compact" data-action="edit-service" type="button">Edit</button>'}
      ${canDeleteService && !isMsoMotorItem ? '<button class="table-action compact danger" data-action="delete-service" type="button">Hapus</button>' : ""}
    </div>
  `;
  return card;
}

function getSortedServiceItems(items) {
  return [...items].sort((left, right) => {
    const leftTime = new Date(left?.payload?.inspectionDate || left?.inspectionDate || 0).getTime() || 0;
    const rightTime = new Date(right?.payload?.inspectionDate || right?.inspectionDate || 0).getTime() || 0;
    return rightTime - leftTime;
  });
}

function syncServiceItemCache(items) {
  serviceItemCache.clear();
  items.forEach((item) => {
    if (!item?.id) {
      return;
    }
    serviceItemCache.set(item.id, {
      ...item,
      payload: item.payload || {},
    });
  });
}

function renderServiceBoard(items, options = {}) {
  if (!serviceCardList) {
    return;
  }
  const previewLimit = Number.isFinite(options.previewLimit) ? options.previewLimit : 5;
  const syncCache = options.syncCache !== false;

  const groups = [
    {
      key: "Electrical",
      title: "Electrical",
      sections: [
        { key: "service-electrical-room", title: "Electrical Room" },
        { key: "service-motor-mso", title: "Service Motor MSO" },
        { key: "service-motor-mv-carbon-brush", title: "Motor MV (Carbon Brush)" },
        { key: "service-mcc", title: "MCC" },
        { key: "service-ehca", title: "EH/CA" },
      ],
    },
    { key: "Instrument", title: "Instrument" },
    { key: "DCS", title: "DCS" },
  ];

  serviceCardList.innerHTML = "";
  if (syncCache) {
    syncServiceItemCache(items);
  }

  const visibleItems = items.filter((item) => shouldDisplayServiceItem(item));

  groups.forEach((group) => {
    const column = document.createElement("section");
    column.className = "service-column";
    column.dataset.serviceGroup = group.key;
    const groupItems = visibleItems.filter((item) => item.type === group.key);
    const previewGroupItems = getSortedServiceItems(groupItems).slice(0, previewLimit);
    column.innerHTML = `
      <div class="service-column-head">
        <div class="service-column-title">
          <strong>${group.title}</strong>
          <span>${groupItems.length} item</span>
        </div>
        <button class="table-action compact" data-action="detail-service-group" data-service-group="${group.key}" type="button">Detail</button>
      </div>
      <div class="service-list-body" data-service-type="${group.key}"></div>
    `;
    const body = column.querySelector(".service-list-body");

    if (group.key === "Electrical") {
      group.sections.forEach((section) => {
        const sectionItems = groupItems.filter((item) => (item.formType || "") === section.key);
        const previewSectionItems = getSortedServiceItems(sectionItems).slice(0, previewLimit);
        const wrapper = document.createElement("section");
        wrapper.className = "service-subgroup";
        wrapper.dataset.sectionKey = section.key;
        wrapper.innerHTML = `
          <div class="service-subgroup-head">
            <strong>${section.title}</strong>
            <span>${sectionItems.length} item</span>
          </div>
        `;
        const sectionBody = document.createElement("div");
        sectionBody.className = "service-subgroup-body";
        if (previewSectionItems.length) {
          previewSectionItems.forEach((entry) => sectionBody.append(renderServiceCard(entry)));
        } else {
          const empty = document.createElement("div");
          empty.className = "service-list-empty";
          empty.textContent = "Belum ada hasil inspeksi.";
          sectionBody.append(empty);
        }
        wrapper.append(sectionBody);
        body.append(wrapper);
      });
    } else if (previewGroupItems.length) {
      previewGroupItems.forEach((entry) => body.append(renderServiceCard(entry)));
    } else {
      const empty = document.createElement("div");
      empty.className = "service-list-empty";
      empty.textContent = "Belum ada hasil inspeksi.";
      body.append(empty);
    }
    serviceCardList.append(column);
  });

  renderMccReferenceOptions();
}
