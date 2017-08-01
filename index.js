const {db} = require('./pgp');
const express =  require('express');
const app = express();

//---------View Template Engine -------------
const nunjucks = require('nunjucks');
nunjucks.configure('views', {
	autoescape: true,
	cache: false,
	express: app,
	watch: true
});
app.engine('html', nunjucks.render);
app.set('view engine', 'html');
/*
Xem toan bo database trong bảng sinhvien
app.get('/',(req,res)=>{
	db.any('select * from sinhvien')
	.then(data => {
		console.log(data)
	})
});
*/
/*
Trả về kết quả là hàng có điểm số bằng 8
app.get('/',(req,res)=>{
  db.any('SELECT * FROM thanhtich WHERE diemso = $1',[8])
  .then(data =>{
    console.log(data);
  })
  .catch(err =>{
    console.log('ERROR: ',err);
  })
})
*/
/*
Thêm một giá trị vào bảng
  app.get('/',(req,res) =>{
    db.none('INSERT INTO thanhtich (diemso,monhoc) VALUES ($1,$2)',[8,'Toan hoc'])
    .then(() =>{
      console.log('SUCCESS')
    })
    .catch( err =>{
      console.log('ERROR: ',err);
    })
  })
*/
/*
  Trả về kết quả thỏa mãn yêu cầu
  app.get('/',(req,res) =>{
    db.any('SELECT * FROM thanhtich WHERE diemso = $1 AND monhoc = $2',[8,'Toan hoc'])
    .then(data =>{
      console.log('DATA: ', data);
      res.send('SUCCESS')
    })
    .catch( err => {
      console.log('ERROR: ', err);
    })
  })
*/
//Trả về kết quả dạng text thỏa mãn điều kiện bắt đầu của kết quả là chữ "T"
//Lưu ý dùng backtick để bao quanh lệnh Select

/*
  app.get('/',(req,res) =>{
    db.any(`SELECT * FROM thanhtich WHERE monhoc LIKE '%$1#'`,'a')
    .then(data =>{
      console.log('DATA: ', data);
      res.send('SUCCESS')
    })
    .catch( err => {
      console.log('ERROR: ', err);
    })
  })
*/

app.listen(3000,()=>{
  console.log('Server is running in port 3000');
})  
