function formatDateIndo(datetime) {
  const date = new Date(datetime);

  const hari = date.toLocaleDateString("id-ID", { weekday: "long" }); // contoh: Jumat
  const tgl = String(date.getDate()).padStart(2, "0"); // 06
  const bln = String(date.getMonth() + 1).padStart(2, "0"); // 07
  const thn = date.getFullYear(); // 2025
  const jam = String(date.getHours()).padStart(2, "0"); // 07
  const menit = String(date.getMinutes()).padStart(2, "0"); // 00

  return `${hari} ${tgl}/${bln}/${thn} ${jam}:${menit}`;
}

module.exports  = { formatDateIndo };