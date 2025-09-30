const config = require('./helper/config.js');
const { formatDateIndo } = require('./helper/function.js');
const XLSX = require('xlsx');
const fs = require('fs');

async function getCuacaToCSV() {
  try {
    console.log("(2)=== Mulai proses ambil data cuaca ===\n");

    const url = `${config.API}${config.ID_API}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Gagal fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    const blocks = data?.data?.[0]?.cuaca || [];
    let cuacaList = blocks.flat();
    console.log("Data berhasil diambil dari API\n");

    // Ambil semua tanggal unik
    const dates = [
      ...new Set(
        cuacaList.map(i => (i.local_datetime || i.datetime).slice(0, 10))
      )
    ];

    // Buat list hasil filter 07–18
    const filteredList = [];
    dates.forEach(d => {
      const targetHours = Array.from({ length: 12 }, (_, i) => i + 7);
      targetHours.forEach(h => {
        const found = cuacaList.find(item => {
          const dtStr = item.local_datetime || item.datetime; 
          const datePart = dtStr.slice(0, 10);
          const hourPart = parseInt(dtStr.slice(11, 13), 10);
          return datePart === d && hourPart === h;
        });

        if (found) {
          filteredList.push(found);
        } else {
          const hh = String(h).padStart(2, "0");
          const localDatetimeStr = `${d} ${hh}:00:00`;

          filteredList.push({
            local_datetime: localDatetimeStr,
            datetime: `${d}T${hh}:00:00Z`,
            t: null,
            hu: null,
            weather_desc: "Tidak ada data",
            wd: "",
            wd_deg: "",
            ws: null,
            tp: null
          });
        }
      });
    });

    console.log(`Jumlah data cuaca setelah filter: ${filteredList.length}\n`);

    const filename = "data.csv";
    let rows = [];

    if (fs.existsSync(filename)) {
      // baca CSV lama
      const oldWorkbook = XLSX.readFile(filename);
      const oldSheet = oldWorkbook.Sheets[oldWorkbook.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(oldSheet, { header: 1 });
    }

    // kalau file kosong, bikin header baru
    if (rows.length === 0) {
      rows = [
        [
          "DATA API","DATA API","DATA API","DATA API","DATA API","DATA API","DATA API",
          "DATA MANUAL","DATA MANUAL","DATA MANUAL"
        ],
        [
          "Datetime","Suhu (C)","Kelembapan (%)","Cuaca","Arah Angin",
          "Kecepatan Angin (km/jam)","Curah Hujan (mm)",
          "Waktu di ambil","Suhu (C)","Cuaca"
        ]
      ];
    }

    let updated = false;

    filteredList.forEach(item => {
      const datetimeFormatted = formatDateIndo(item.local_datetime || item.datetime);

      const newRow = [
        datetimeFormatted,
        item.t,
        item.hu,
        item.weather_desc,
        item.wd ? `${item.wd} (${item.wd_deg})` : "",
        item.ws,
        item.tp
      ];

      const idx = rows.findIndex(r => r[0] === datetimeFormatted);

      if (idx !== -1) {
        // sudah ada baris
        const manualCols = rows[idx].slice(7, 10);
        const manualFilled = manualCols.some(val => String(val ?? "").trim() !== "");

        if (manualFilled) {
          console.log(`[LOCKED] ${datetimeFormatted}`);
          return;
        }

        const oldRow = rows[idx].slice(0, 7);
        const isDifferent = oldRow.some((val, i) => String(val ?? "") !== String(newRow[i] ?? ""));

        if (isDifferent) {
          const oldHasData = oldRow.some((val, i) =>
            i > 0 && String(val ?? "").trim() !== "" && String(val) !== "Tidak ada data"
          );
          const newHasData = newRow.some((val, i) =>
            i > 0 && String(val ?? "").trim() !== "" && String(val) !== "Tidak ada data"
          );

          if ((!oldHasData && newHasData) || (oldHasData && newHasData)) {
            rows[idx].splice(0, 7, ...newRow);
            console.log(`\n[UPDATE]`);
            console.log(`   Dari: ${oldRow.join(" | ")}`);
            console.log(`   Ke  : ${newRow.join(" | ")}\n`);
            updated = true;
          } else {
            console.log(`[SKIP] ${datetimeFormatted}`);
          }
        } else {
          console.log(`[SKIP] ${datetimeFormatted} no change`);
        }
      } else {
        // baris baru
        rows.push([...newRow, "", "", ""]);
        console.log(`[NEW] ${datetimeFormatted} add`);
        updated = true;
      }
    });

    // simpan ke CSV
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const csvData = XLSX.utils.sheet_to_csv(worksheet);
    fs.writeFileSync(filename, csvData, "utf8");

    if (updated) {
      console.log(`\nData cuaca berhasil diperbarui ke ${filename}`);
    } else {
      console.log("\nTidak ada data baru untuk diperbarui");
    }

    console.log("=== Proses CSV selesai ===");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

getCuacaToCSV();
