import React from "react";
import { Link, Route, NavLink } from "react-router-dom";
import "../styles/User.scss";
import Modal from "./Modal";

function User({
  name,
  onChange,
  onSave,
  wishList,
  commentList,
  unregisterModal,
  unregisterModalOpen,
  resetModalOpen,
  resetModal,
  onLogout,
  activeStyle,
  onReset,
  onUnregister
}) {
  console.log("User");

  return (
    <div className="menu">
      <div className="menu__inner">
        <ul className="setting">
          <li>
            <NavLink exact to="/user" activeStyle={activeStyle}>
              계정
            </NavLink>
          </li>
          <li>
            <NavLink to="/user/commentList" activeStyle={activeStyle}>
              영화 평가
            </NavLink>
          </li>
          <li>
            <NavLink to="/user/wishList" activeStyle={activeStyle}>
              보고싶어요
            </NavLink>
          </li>
        </ul>
      </div>

      <Route
        path="/user"
        exact
        render={() => (
          <div className="user">
            <ul>
              <li className="nickname">
                <span className="title">닉네임</span>
                <div className="row">
                  <input placeholder={name} onChange={onChange} />
                  <button className="button" onClick={onSave}>
                    저장
                  </button>
                </div>
              </li>
              <li className="reset">
                <span className="title">초기화</span>
                <div className="row">
                  <span>별점 평가의 내역을 초기화 합니다.</span>
                  <button className="button" onClick={resetModalOpen}>
                    초기화
                  </button>
                </div>
                <Modal isOpen={resetModal} onClick={onReset}>
                  별점평가 기록이 모두 삭제됩니다. 삭제된 내용은 복구 할 수
                  없어요
                  <br />
                  초기화를 하시겠어요?
                </Modal>
                {/* <div className="modal-wrapper" style={{ display: resetModal }}>
                  <div className="modal">
                    <p>
                      별점평가 기록이 모두 삭제됩니다. 삭제된 내용은 복구 할 수
                      없어요
                      <br />
                      초기화를 하시겠어요?
                    </p>
                    <div class="btn-wrapper">
                      <button onClick={onResetModal}>취소</button>
                      <button onClick={onReset}>초기화</button>
                    </div>
                  </div>
                </div> */}
              </li>
              <li>
                <button className="button" onClick={onLogout}>
                  <Link className="login__link" to="/">
                    로그아웃
                  </Link>
                </button>
              </li>
              <li>
                <button
                  className="btn-unregister"
                  onClick={unregisterModalOpen}
                >
                  계정 탈퇴
                </button>

                <Modal isOpen={unregisterModal} onClick={onUnregister}>
                  지금 탈퇴를 하시면 모든 내용이 사라집니다. 한번 삭제된 계정은
                  영구히 되돌릴 수 없어요.
                  <br />
                  그래도 탈퇴를 진행하시겠어요?
                </Modal>
                {/* <div
                  className="modal-wrapper"
                  style={{ display: unregisterModal }}
                >
                  <div className="modal">
                    <strong>{name}님, </strong>
                    <p>
                      지금 탈퇴를 하시면 모든 내용이 사라집니다. 한번 삭제된
                      계정은 영구히 되돌릴 수 없어요.
                      <br />
                      그래도 탈퇴를 진행하시겠어요?
                    </p>
                    <div class="btn-wrapper">
                      <button onClick={onUnregisterModal}>취소</button>
                      <button onClick={onUnregister}>탈퇴</button>
                    </div>
                  </div>
                </div> */}
              </li>
            </ul>
          </div>
        )}
      />

      <Route
        path="/user/commentList"
        render={() => (
          <div className="list">
            <div className="list__inner">
              <ul>
                {commentList.map(comment => (
                  <li>
                    <Link to={`/${comment.id}`}>
                      <img src={comment.poster} alt={comment.title} />
                    </Link>
                    <span className="title">
                      {comment.title.length > 13
                        ? `${comment.title.substring(0, 13)}...`
                        : comment.title}
                    </span>
                    <div>
                      <span className="star">별</span>
                      <span>{comment.score}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      />

      <Route
        path="/user/wishList"
        render={() => (
          <div className="list">
            <div className="list__inner">
              <ul>
                {wishList.map(wish => (
                  <li>
                    <Link to={`/${wish.id}`}>
                      <img src={wish.poster} alt={wish.title} />
                    </Link>
                    <span className="title">{wish.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      />
    </div>
  );
}

export default User;
