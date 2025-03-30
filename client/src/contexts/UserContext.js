import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
export const UserContext = createContext();

export const UserProvider = ({ children, isLoggedIn }) => {
  const [userInfo, setUserInfo] = useState({
      username:'',
      email: '',
    });
  useEffect(() => {
    const fetchData = async () => {
      if (!isLoggedIn) return;
      try {
        const response = await axios.get('http://192.168.1.100:5001/profile', {
          headers: {
            Authorization: `Bearer: ${localStorage.getItem("token")}`
          }
        });        
        setUserInfo(response.data);
      } catch (error) {
        localStorage.removeItem("token");
        console.error('Error fetching data: ', error);
      }
    }
    fetchData();
    }, [isLoggedIn]);

    return (
      <UserContext.Provider value={{userInfo, setUserInfo}}>
        {children}
      </UserContext.Provider>
    )
}