## INSTALASI
jalankan aplikasi dengan perintah berikut
```bash
npm start
```

## KETENTUAN PENGUJIAN
- pengujian dilakukan selama 7 hari di satu tempat (jorong)
- data pengujian di ambil setiap 3 jam sekali
- pengujian hanya dilakukan dari jam 7 pagi hingga 6 malam

## CATATAN
> - sistem hanya mengambil data per 1 jam dari jam 7 pagi hingga 6 malam (7,10,13,16)
> - sumber data di berasal dari BMKG
> - BMKG hanya menyediakan data prakiraan per 3 jam
> - berdasarkan pengamatan yang dilakukan, dari jam 12.00 hingga jam 14.00 api tidak melakukan pembaruan data

## format pengisian data manual
untuk menghindari perubahan nilai data otomatis, tambahkan huruf di deoan waktu.
contoh:
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


(lokasi api cuaca)[https://maps.app.goo.gl/KVR62xMKJ7UECz5p9]