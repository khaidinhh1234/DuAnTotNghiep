import React, { useEffect } from 'react';

import { Row, Col } from 'antd';
import { PostTextBox } from './PostTextBox';

const Post = () => {
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(fetchPosts());
  // }, [dispatch]);

//   const getPosts: PostType[] = useSelector((state) => state.userpostsReducer.posts);

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <PostTextBox />
      </Col>
      {/* {getPosts.map((posts) => {
        return (
          <Col span={24} key={posts.id}>
            <PostItem post={posts} />
          </Col>
        );
      })} */}
    </Row>
  );
};

export default Post;
