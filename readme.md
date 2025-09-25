## INSTALASI
```bash
npm start
```

## KETENTUAN YANG BERLAKU
- pengujian dilakukan selama seminggu di dua tempat berbeda (jorong dan banjarbaru)
- data pengujian di ambil setiap 3 jam
- pengujian hanya dilakukan dari jam 6 pagi hingga 6 malam

## CATATAN
> sistem hanya mengambil data per 1 jam dari jam 7 pagi hingga 6 malam (7,10,13,16)
> sumber data di ambil dari BMKG

## format pengisian data manual
waktu di ambil (tambahkan abjad di depan waktu untuk menghindari nilai data berubah)
> contoh
```c
s 11:03
```

## STRUKTUR DATA
```json
{
    "lokasi":{
        "adm1": "0",
        "adm2": "0.0",
        "adm3": "0.0.0",
        "adm4": "0.0.0.0",
        "provinsi": "",
        "kotkab": "",
        "kecamatan": "",
        "desa": "",
        "lon": 0,
        "lat": 0,
        "timezone": "+0",
        "type": "adm4"
    },
    "data":[
        {
            "lokasi":{},
            "cuaca":[
                {}
            ]
        }
    ]
}
```