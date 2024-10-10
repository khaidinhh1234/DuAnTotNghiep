import React, { useEffect } from 'react';
import { Typography, Skeleton, Card } from 'antd';
import { Image } from 'antd';

const photos = [
  { img: "https://picsum.photos/200", id: 1 },
  { img: "https://picsum.photos/200", id: 2 },
  { img: "https://picsum.photos/200", id: 3 },
  { img: "https://picsum.photos/200", id: 4 },
  { img: "https://picsum.photos/200", id: 5 },
  { img: "https://picsum.photos/200", id: 6 },
  { img: "https://picsum.photos/200", id: 7 },
  { img: "https://picsum.photos/200", id: 8 },
  { img: "https://picsum.photos/200", id: 9 },
];

const PhotosCard = () => {
  const [isLoading, setLoading] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="shadow-md p-4">
      <Typography.Title level={4}>Photos</Typography.Title>
      <div className="grid grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div key={photo.id}>
            {isLoading ? (
              <Skeleton.Image
                style={{ width: '100%', height: '100px', borderRadius: '8px' }}
              />
            ) : (
              <Image
                src={photo.img}
                alt="photo"
                className="rounded-lg"
                style={{ width: '100%', height: '100px' }}
                preview={false}
              />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PhotosCard;
