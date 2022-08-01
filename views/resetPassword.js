import axios from "axios";
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

export default resetPassword;