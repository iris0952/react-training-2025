import { useState } from 'react'
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [tempProduct, setTempProduct] = useState({})
  const [products, setProducts] = useState([]);
  const [ user, setUser ] = useState({
    username: '',
    password: ''
  });

  function handleUser(e) {
    const { name, value } = e.target;
    setUser({//會全部覆蓋值
      ...user,//展開：把原始物件展開帶入
      [name]: value
    })
    // console.log(user);
  }

  // 登入 async await 的寫法
  const login = async(e) => {
    e.preventDefault();//可以解除button的預設行為，這樣 button 可以不加入 type="button" 然後使用 Enter，就可以觸發事件。
    
    try {
        const res = await axios.post(`${BASE_URL}/v2/admin/signin`, user)
        //取得 token
        const { token, expired } = res.data;
        document.cookie = `camiToken=${token}; expires='${new Date(expired)}'; path=/`;

        axios.defaults.headers.common['Authorization'] = token;//帶入 token

        //取得產品列表
        try {
          const res = await axios.get(`${BASE_URL}/api/${API_PATH}/admin/products`)
          setProducts(res.data.products)
        } catch (error) {
          console.error(error)
        }

        setIsAuth(true);
      
    } catch (error) {
      console.log('登入失敗');
      
    }
  }

  
  const checkUserLogin = async() => {
    try {
      await axios.post(`${BASE_URL}/v2/api/user/check`)
      alert('使用者已登入')
      
    } catch (error) {
      console.log(error);
      
    }
  }

  

  return (
    <>
      {isAuth ? (<div className="container py-5">
      <div className="row">
        <div className="col-6">

          <h2>產品列表 <button type="button" onClick={checkUserLogin} className="btn btn-sm btn-warning ms-2">驗證是否登入</button></h2>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">產品名稱</th>
                <th scope="col">原價</th>
                <th scope="col">售價</th>
                <th scope="col">是否啟用</th>
                <th scope="col">查看細節</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <th scope="row">{product.title}</th>
                  <td>{product.origin_price}</td>
                  <td>{product.price}</td>
                  <td>{product.is_enabled}</td>
                  <td>
                    <button
                      onClick={() => setTempProduct(product)}
                      className="btn btn-info"
                      type="button"
                    >
                      查看細節
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-6">
          <h2>單一產品細節</h2>
          {tempProduct.title ? (
            <div className="card">
              <img
                src={tempProduct.imageUrl}
                className="card-img-top img-fluid"
                alt={tempProduct.title}
              />
              <div className="card-body">
                <h5 className="card-title">
                  {tempProduct.title}
                  <span className="badge text-bg-primary">
                    {tempProduct.category}
                  </span>
                </h5>
                <p className="card-text">商品描述：{tempProduct.description}</p>
                <p className="card-text">商品內容：{tempProduct.content}</p>
                <p className="card-text">
                  <del>{tempProduct.origin_price} 元</del> / {tempProduct.price}{" "}
                  元
                </p>
                <h5 className="card-title">更多圖片：</h5>
                {tempProduct.imagesUrl?.map((image) => (image && (<img key={image} src={image} className="img-fluid" />)))}
              </div>
            </div>
          ) : (
            <p>請選擇一個商品查看</p>
          )}
        </div>
      </div>
    </div>) :<div className="conatiner">
        <div className="row">
          <div className="col-8 m-auto">
            <div className="d-flex flex-column justify-content-center align-items-center vh-100">
              <h1 className="mb-5">請先登入</h1>
              <form onSubmit={login} className="d-flex flex-column gap-3" style={{width: '300px'}}>
                <div className="form-floating mb-3">
                  <input type="email" className="form-control" id="username" placeholder="name@example.com" value={user.username} name="username" onChange={handleUser} />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                  <input type="password" className="form-control" id="password" placeholder="Password" value={user.password} name="password" onChange={handleUser}/>
                  <label htmlFor="password">Password</label>
                </div>
                <button className="btn btn-info">登入</button>
              </form>
              <p className="mt-5 mb-3 text-muted">&copy; 2025 ∞~ React 作品實戰 ~∞</p>
            </div>
          </div>
        </div>
      </div>
      }
      
      
    </>
  )
}

export default App
