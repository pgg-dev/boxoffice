import React from "react";
import styled from "styled-components";

function Comment({ isLogin, writer, comment, onChange, onClick }) {
  return (
    <CommentContainer>
      <CommentBox>
        <CommentText
          onChange={onChange}
          placeholder={
            isLogin
              ? "영화 리뷰를 작성해 주세요."
              : "로그인 후 이용가능한 서비스입니다."
          }
          readOnly={!isLogin}
        />
        <CommnetButton onClick={onClick}>입력</CommnetButton>
      </CommentBox>

      <CommentList>
        {comment.map((content, index) => (
          <CommentItem key={index}>
            <p> {content.text}</p>
          </CommentItem>
        ))}
      </CommentList>
    </CommentContainer>
  );
}

const CommentContainer = styled.div`
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  width: 850px;
`;
const CommentBox = styled.div`
  display: flex;
  height: 80px;
`;
const CommentText = styled.textarea`
  flex: 1;
`;
const CommnetButton = styled.button`
  width: 80px;
`;
const CommentList = styled.ul`
  list-style: none;
`;

const CommentItem = styled.li`
  border-top: 1px solid #d9d9d9;
  :last-child {
    border-bottom: 1px solid #d9d9d9;
  }
  padding: 20px 0 20px 20px;
`;

export default Comment;
