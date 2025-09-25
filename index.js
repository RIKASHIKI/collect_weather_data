const config = require('./helper/config.js');
const { formatDateIndo } = require('./helper/function.js');
const XLSX = require('xlsx');
const fs = require('fs');
//const data = JSON.parse(fs.readFileSync('./dummy.json', 'utf-8'));

async function getCuacaToExcel() {
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

    // Filter sesuai jam penelitian: 06:00,09:00,12:00,15:00,18:00
    cuacaList = cuacaList.filter(item => {
      const date = new Date(item.local_datetime || item.datetime);
      const hour = date.getHours();
      return hour >= 7 && hour <= 18;
    });

    console.log(`Jumlah data cuaca setelah filter: ${cuacaList.length}\n`);

    const filename = "test.xlsx";
    let workbook, worksheet, rows = [];

    if (fs.existsSync(filename)) {
      workbook = XLSX.readFile(filename);
      worksheet = workbook.Sheets["index"];
      if (worksheet) {
        rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      } else {
        
        console.log("Membuat header baru");
        rows = [
          ["DATA API","DATA API","DATA API","DATA API","DATA API","DATA API","DATA API",
           "DATA MANUAL","DATA MANUAL","DATA MANUAL"],
          ["Datetime","Suhu (°C)","Kelembapan (%)","Cuaca","Arah Angin","Kecepatan Angin (km/jam)","Curah Hujan (mm)",
           "Waktu di ambil","Suhu (°C)","Cuaca"]
        ];
      }
    } else {
      console.log(`File ${filename} belum ada membuat workbook baru`);
      workbook = XLSX.utils.book_new();
      rows = [
        ["DATA API","DATA API","DATA API","DATA API","DATA API","DATA API","DATA API",
         "DATA MANUAL","DATA MANUAL","DATA MANUAL"],
        ["Datetime","Suhu (°C)","Kelembapan (%)","Cuaca","Arah Angin","Kecepatan Angin (km/jam)","Curah Hujan (mm)",
         "Waktu di ambil","Suhu (°C)","Cuaca"]
      ];
    }

    let updated = false;

    cuacaList.forEach(item => {
      const datetimeFormatted = formatDateIndo(item.local_datetime || item.datetime);

      // Cari index row lama
      const idx = rows.findIndex(r => r[0] === datetimeFormatted);

      if (idx !== -1) {
        // Simpan kolom manual sebelum update
        const manualCols = [rows[idx][7] || "", rows[idx][8] || "", rows[idx][9] || ""];

        // Update data API hanya jika kolom manual kosong
        if (!manualCols.some(val => val !== "")) {
          rows[idx].splice(0, 7, 
            datetimeFormatted,
            item.t,
            item.hu,
            item.weather_desc,
            `${item.wd} (${item.wd_deg}°)`,
            item.ws,
            item.tp
          );
          updated = true;
        }
      } else {
        // Tambahkan data baru dari API
        rows.push([
          datetimeFormatted,
          item.t,
          item.hu,
          item.weather_desc,
          `${item.wd} (${item.wd_deg}°)`,
          item.ws,
          item.tp,
          "", "", "" // kolom manual kosong
        ]);
        updated = true;
      }
    });

    worksheet = XLSX.utils.aoa_to_sheet(rows);
    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
      { s: { r: 0, c: 7 }, e: { r: 0, c: 9 } }
    ];

    // Tetapkan format custom untuk kolom manual
    for (let i = 2; i < rows.length; i++) {
      if (worksheet[`H${i+1}`]) worksheet[`H${i+1}`].z = '0.000000000'; // Waktu di ambil
      if (worksheet[`I${i+1}`]) worksheet[`I${i+1}`].z = '0';           // Suhu manual
      if (worksheet[`J${i+1}`]) worksheet[`J${i+1}`].z = '@';           // Cuaca manual (teks)
    }

    const sheetName = "index";
    if (workbook.SheetNames.includes(sheetName)) {
      workbook.Sheets[sheetName] = worksheet;
    } else {
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    }

    XLSX.writeFile(workbook, filename);

    if (updated) {
      console.log(`Data cuaca berhasil diperbarui ke ${filename}`);
    } else {
      console.log("Tidak ada data baru untuk diperbarui");
    }

    console.log("=== Proses 2 selesai ===");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

getCuacaToExcel();
