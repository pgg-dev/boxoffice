import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import User from "../components/User";
import {
  updateUser,
  resetComment,
  goToPath,
  setLogout
} from "../modules/movies";

function UserContainer() {
  console.log("UserContainer");
  const [unregisterModal, setUnregisterModal] = useState("none");
  const [resetModal, setResetModal] = useState("none");

  const { id, name, commentList, wishList, provider } = useSelector(
    state => state.movies.user
  );
  const dispatch = useDispatch();

  let changeName;
  const handleChange = e => {
    changeName = e.target.value;
  };

  const handleSave = e => {
    dispatch(updateUser("name", id, changeName));
    alert("설정이 저장되었습니다.");
  };

  const handleReset = result => {
    if (result) {
      let movieId = [];
      if (commentList) {
        commentList.forEach(item => {
          movieId.push(item.id);
        });
      }
      dispatch(resetComment(movieId, id));
      dispatch(updateUser("commentList", id, []));
      setResetModal("none");
    } else {
      setResetModal("none");
    }
  };

  const handleUnregister = result => {
    if (result) {
      setUnregisterModal("none");
      if (provider === "kakao") {
        window.Kakao.API.request({
          url: "/v1/user/unlink",
          success: res => {
            console.log(res);
          },
          fail: error => {
            console.log(error);
          }
        });
      } else {
        const googleAuth = window.gapi.auth2.getAuthInstance();
        googleAuth.disconnect();
      }

      dispatch(updateUser("delete", id));
      dispatch(goToPath("/"));
      dispatch(setLogout());
    } else {
      setUnregisterModal("none");
    }
  };

  const handleLogout = () => {
    console.log("onLogout");
    if (provider === "kakao") {
      window.Kakao.Auth.logout();
      console.log("카카오 로그아웃 성공");
      dispatch(setLogout());
    } else {
      const googleAuth = window.gapi.auth2.getAuthInstance();
      googleAuth.signOut();
      console.log("구글 로그아웃 성공");
      dispatch(setLogout());
    }
  };

  const activeStyle = {
    color: "#03cf5d",
    fontWeight: "600",
    borderBottom: "3px solid #03cf5d"
  };

  return (
    <User
      name={name}
      onChange={handleChange}
      onSave={handleSave}
      wishList={wishList}
      commentList={commentList}
      onLogout={handleLogout}
      activeStyle={activeStyle}
      resetModal={resetModal}
      setResetModal={setResetModal}
      onReset={handleReset}
      unregisterModal={unregisterModal}
      setUnregisterModal={setUnregisterModal}
      onUnregister={handleUnregister}
    />
  );
}

export default UserContainer;
