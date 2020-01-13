import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Movie from "../components/Movie";
import {
  getMovie,
  updateComment,
  getComment,
  updateUser,
  goToPath,
  getUser
} from "../modules/movies";
import moment from "moment";

function MovieContainer({ movieId }) {
  const { data, loading, error } = useSelector(state => state.movies.movie);
  const { login, name, id, wishList, commentList } = useSelector(
    state => state.movies.user
  );
  const { comments } = useSelector(state => state.movies);
  const { movieList } = useSelector(state => state.movies.movies);
  const dispatch = useDispatch();
  const [heart, setHeart] = useState(false);
  const [star, setStar] = useState("");
  const [text, setText] = useState("");
  const [loginModal, setLoginModal] = useState("none");

  useEffect(() => {
    dispatch(getUser(id));
    let movieData;
    if (!movieList) {
      movieData = JSON.parse(window.localStorage.getItem(movieId));
    } else {
      // if (url.includes("daily")) {
      //   movieData = dailyData.find(movie => movie.id === movieId);
      // } else {
      //   movieData = weeklyData.find(movie => movie.id === movieId);
      // }
      window.localStorage.setItem(movieId, JSON.stringify(movieData));
    }
    dispatch(getMovie(movieId));

    wishList.forEach(item => {
      if (item.id === movieId) {
        setHeart(true);
      }
    });
    setStar("");
    dispatch(getComment(movieId));
    // deleteBtnVisible();
    return () => {
      window.localStorage.clear();
    };
  }, [dispatch, movieId]);

  // const loginCheck = callback => {
  //   if (!login) {
  //     console.log("로그인 ㄴㄴ");
  //     const isLogin = window.confirm("로그인 페이지로 이동 하시겠습니까?");
  //     if (isLogin) {
  //       dispatch(goToPath("/login"));
  //     }
  //     // return;
  //   } else {
  //     console.log("로그인 상태");
  //     callback();
  //   }
  // };

  const loginCheck = result => {
    if (result) {
      dispatch(goToPath("/login"));
    } else {
      setLoginModal("none");
    }
  };

  const starCheck = val => {
    console.log("starCheck");
    return val === star ? "on" : "";
  };

  const handleScore = score => {
    console.log(score);
    if (!login) {
      setLoginModal("flex");
    } else {
      setStar(score);
    }
  };

  const starGroup = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

  const handleChange = e => {
    console.log("handleChange");
    if (!login) {
      setLoginModal("flex");
    } else {
      setText(e.target.value);
    }
  };

  let movieComment = comments;
  let userComment = commentList;

  const handleAddComment = e => {
    console.log("handleAddComment");
    if (!login) {
      setLoginModal("flex");
    } else {
      let userCheck = false;
      movieComment.forEach(item => {
        if (item.id === id) {
          userCheck = true;
        }
      });

      if (userCheck) {
        alert("이미 작성한 리뷰가 존재합니다.");
      } else {
        movieComment.push({
          text: text,
          name: name,
          id: id,
          score: star,
          reg_date: moment().format("YYYY.MM.DD")
        });

        userComment.push({
          id: movieId,
          title: data.title,
          poster: data.poster,
          text: text,
          score: star
        });

        dispatch(updateComment(movieComment, movieId));
        dispatch(updateUser("commentList", id, userComment));
        setStar("");
        setText("");
      }
    }
  };

  const handleDelete = e => {
    console.log("handDelete");
    const resultMovieComment = movieComment.filter(
      comment => comment.id !== id
    );
    dispatch(updateComment(resultMovieComment, movieId));

    const resultUserComment = userComment.filter(
      comment => comment.id !== movieId
    );
    dispatch(updateUser("commentList", id, resultUserComment));
  };

  const handleAddWishList = e => {
    let updateWishList = wishList;

    if (!login) {
      setLoginModal("flex");
    } else {
      if (heart) {
        setHeart(false);
        updateWishList = wishList.filter(item => item.id !== movieId);
      } else {
        setHeart(true);
        const { title, poster } = data;
        updateWishList.push({
          id: movieId,
          title: title,
          poster: poster
        });
      }
      dispatch(updateUser("wishList", id, updateWishList));
    }
  };

  if (loading && !data) return <div>로딩중...</div>;
  if (error) return <div>에러 발생</div>;
  if (!data) return <div>데이터 없음</div>;

  return (
    <Movie
      movie={data}
      isLogin={login}
      comments={comments}
      onChange={handleChange}
      onAddComment={handleAddComment}
      onDelete={handleDelete}
      starCheck={starCheck}
      onScore={handleScore}
      starGroup={starGroup}
      id={id}
      onAddWishList={handleAddWishList}
      heart={heart}
      text={text}
      loginModal={loginModal}
      loginCheck={loginCheck}
    />
  );
}

export default MovieContainer;
