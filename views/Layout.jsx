import React, { useState } from 'react';
// import { Header } from "../frontend/src/components/Header/index.js";
// import { Footer } from "../frontend/src/components/Footer/index.js";
import styled from 'styled-components'
// import "./reset.css";
const axios = require('axios');
import { createUseStyles } from 'react-jss'

const resetPassword = async (e) => {
  e.preventDefault();
  console.log("Getting information from input");
  try {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    console.log('reseting password')
    const { data } = await axios.post(
      '/api/users/reset/:token',
      {
        password
      },
      config,
    );
    console.log(data)
    console.log('your password has been reset')
  } catch (error) {
    console.log(error);
    console.log("Cannot reset password ");
  }
}

const styles = createUseStyles({
  // pages_container: {
  //   display: 'flex',
  //   flexDirection: 'column',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   backgroundColor: '#f5f5f5',
  // },
  
  form_container: {
    // width: 400px,
    // height: 350px,
    backgroundColor: 'rgb(255, 255, 255)',
    // borderRadius: 15px,
    display: 'block',
    // margin: 0 auto,
    // padding: 25px,
    position: 'relative',
    // top: 25px
  },
  
  btn_send: {
    borderStyle: 'none',
    // width: 40 %;
    backgroundColor: 'green',
    cursor: 'pointer',
    color: 'aliceblue',
    // border - radius: 5px;
    // font - size: 1.5rem;
    // padding: 10px 5px;
    // margin: 0 auto;
    // margin - top: 25px;
    display: 'block',
  }
})
export default function ResetPasswordView() {
  const [password, setPassword] = React.useState('');
  const [retypePassword, setRetypePassword] = React.useState("");
  const [isOpenModal, setIsOpenModal] = React.useState(false);
  
  const PageContainer = styled.div`  
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `
  const classes = styles();
  return (
    <div>
      {/* <Header isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} /> */}

      <PageContainer>
        <p className="page-heading">Reset Password</p>
        <form method='POST' className={classes.form_container} onSubmit={resetPassword}>
          <label className='form-label'>
            Password
          </label>
          <input
            required
            type="password"
            name="password"
            placeholder="Enter your new password to reset"
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
            value=''
          />
          <form_label>
            Retype Password
          </form_label>
          <input
            required
            type="password"
            placeholder="Enter your new password again"
            className="form-control"
            onChange={(e) => setRetypePassword(e.target.value)}
            value={retypePassword}
          />

          <button
            className="btn_send"
            variant="primary"
            type="submit"
            onClick={resetPassword}
          >
            Reset Password
          </button>
        </form>
      </PageContainer>
      {/* <Footer></Footer> */}
    </div>
  )
};

if (typeof window != "undefined") {
  window.addEventListener('load', function () {
    loadProps(ClientApp, ClientApp.displayName)
  })
}