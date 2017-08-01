# Kết nối Postgres và Express qua database drive pg-promise dùng docker làm server.

## B1: Pull images postgres và pgadmin4 về, tạo container để chạy postgres và pgadmin4.
>Khởi tạo 2 container postgres và pgadmin4 với thông số cụ thể ở dưới(Lưu ý thông số để kết nối với Express):

```
docker run --name pg -p 5433:5432 -e POSTGRES_PASSWORD=123 -d postgres:9.6.2-alpine
```

*   username: postgres, <br />
    password: 123,<br />
    port: 5433

````
docker run --name pgadmin --link pg:postgres  -p 5050:5050  -d fenglc/pgadmin4
````
* Port đăng nhập pgadmin4: 5050<br />
  user: pgadmin4@pgadmin.org<br />
  password: admin <br />
* Tạo một server: username là postgres + password là 123 + port 5432
* Tạo thử một database tên là <strong>students</strong>
## B2: Khởi tạo project Express
1. Khởi tạo project:

```js
  npm init
```
2. Download modules cần thiết: express, pg-promise, bluebird,
```js
  npm install express pg-promise bluebird --save
```
3. Tạo 1 folder config trên root, trong folder khởi tạo 1 file tên config.json(Kết nối postgres với express):
```json
{
  "development": {
    "username": "postgres",
    "password": "123",
    "database": "students",
    "host"    : "localhost",
    "port"    : 5433,
    "dialect" : "postgres",
    "schema"  : "public",
    "logging" : false
  }
```
* Lưu ý các thông số đúng theo lúc khởi tạo container docker.
* Mặc định host là "localhost",schema là "public"
4. Tạo một file pgp.js - file config của pg-promise:

```js
  /**
 * Created by techmaster on 1/17/17.
 */
  const path = require("path");
  const env = process.env.NODE_ENV || "development";
  const config = require(path.join(__dirname, 'config', 'config.json'))[env];
  const Promise = require('bluebird');
  //const monitor = require("pg-monitor");

  const cn = {
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.username,
    password: config.password
  };

  const options = {
    promiseLib: Promise // overriding the default (ES6 Promise);
  };
  const pgp = require('pg-promise')(options);
  // Khi có lỗi phải bật monitor để quan sát câu lệnh SQL
  //monitor.attach(options);
  //monitor.setTheme('bright');
  module.exports.db = pgp(cn);
  module.exports.config = config;
```

5. Khởi tạo file index.js với các thông số cơ bản của express, khai báo thêm module pg được exports từ file pgp.js:

```js
const {db} = require('./pgp')
```
## B3: Kiểm tra kết nối thành công chưa:

1. Dùng hàm app.get để kiểm tra trên console.log có kết quả trả về từ database hay không:
```js
app.get('/',(req,res)=>{
	db.any('select * from sinhvien')
	.then(data => {
		console.log(data)
	})
});
```
2. Start server và xem kết quả.

```js
  npm node index.js
```# postgres-pg-promise

## B4: Dùng một số hàm cơ bản với pg-promise

1.  Trả về kết quả là hàng có điểm số bằng 8

```js
 app.get('/',(req,res)=>{
   db.any('SELECT * FROM thanhtich WHERE diemso =     $1',[8])
    .then(data =>{
    console.log(data);
     })
    .catch(err =>{
     console.log('ERROR: ',err);
     })
 }) 
 ```
 2. Thêm một giá trị vào bảng

 ```js
  app.get('/',(req,res) =>{
    db.none('INSERT INTO thanhtich (diemso,monhoc) VALUES ($1,$2)',[8,'Toan hoc'])
    .then(() =>{
      console.log('SUCCESS')
    })
    .catch( err =>{
      console.log('ERROR: ',err);
    })
  })
 ```

 3. Trả về kết quả thỏa mãn yêu cầu

 ```js
  app.get('/',(req,res) =>{
    db.any('SELECT * FROM thanhtich WHERE diemso = $1 AND monhoc = $2',[8,'Toan hoc'])
    .then(data =>{
      console.log('DATA: ', data);
    })
    .catch( err => {
      console.log('ERROR: ', err);
    })
  })
 ```

 4. Trả về kết quả dạng text thỏa mãn điều kiện bắt đầu của kết quả là chữ "T"(Lưu ý dùng backtick để bao quanh lệnh Select)

 ```js
  app.get('/',(req,res) =>{
    db.any(`SELECT * FROM thanhtich WHERE monhoc LIKE '%$1#%'`,'T')
    .then(data =>{
      console.log('DATA: ', data);
      res.send('SUCCESS')
    })
    .catch( err => {
      console.log('ERROR: ', err);
    })
  })
 ```
 >Nếu cần tìm kết quả kết thúc bằng kí tự x thì dùng truy vấn '%$1#' để thay thế