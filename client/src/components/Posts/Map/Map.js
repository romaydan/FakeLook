import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { connect } from 'react-redux';
import ReactMapboxGl, { Marker } from 'react-mapbox-gl';
import Container from '../Container/Container';
import { setPosts } from '../../../actions/posts.actions';
import { FaMapMarker } from 'react-icons/fa';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = props => {
    const { posts, location, setPosts } = props;

    const [scaleFactor, setScaleFactor] = useState(14 * 0.1);
    const [selectedPost, setSelectedPost] = useState(null);
    const mapRef = useRef();

    const defualtSettings = useMemo(() => ({
        center: location,
        zoom: [14]
    }), [location]);

    const Map = useMemo(() => ReactMapboxGl({
        accessToken: 'pk.eyJ1IjoiaWRvbnYiLCJhIjoiY2tscnpsb2R1MGF1ZzJ2cDM1ZWVsbHQwMyJ9.vd9YaH0VyDnsJnjJbF8DIA',
    }), []);

    const FlyToCoordiantes = (coordinates, zoom) => {
        const { state: { map } } = mapRef.current;
        map.flyTo({ center: coordinates, zoom })
    }

    const onZoomChanged = (zoom) => {
        if (zoom < 5) {
            setScaleFactor(0);
            return;
        }

        setScaleFactor(zoom * 0.1)
    }

    const updatePost = (post) => {
        const index = posts.findIndex(p => p.id === post.id);
        if (index > 0) {
            posts[index] = post;
            setPosts([...posts])
        }
    }

    return (
        <Container post={selectedPost} posts={posts} onModalPostViewClosed={() => setSelectedPost(null)} updatePost={updatePost}>
            <Map
                center={location}
                ref={mapRef}
                zoom={defualtSettings.zoom}
                containerStyle={{ width: '100vw', height: '100vh' }}
                onZoomEnd={(map, e) => onZoomChanged(map.getZoom())}
                style={'mapbox://styles/mapbox/streets-v9'}>
                {
                    posts.map((post, i) => <div onClick={() => setSelectedPost(post)}>
                        {
                            posts.length < 30 && <Marker
                                anchor='bottom'
                                coordinates={post.location.coordinates}
                                className='cursor-pointer mt-5 ml-4'>
                                <Image post={post} delay={i} scaleFactor={scaleFactor} />
                            </Marker>
                        }
                        <Marker
                            anchor='center'
                            coordinates={post.location.coordinates}>
                            <FaMapMarker className={' h-9 w-9 fill-red z-20 absolute cursor-pointer ' + (scaleFactor === 0 ? 'hidden' : '')} />
                        </Marker>
                    </div>)
                }
                <Marker coordinates={defualtSettings.center} anchor='center' className='absolute'>
                    <div className=' bg-red-600 h-5 w-5 cursor-pointer shadow-md z-10 hover:scale-125 transform transition' style={{ borderRadius: '50%' }}
                        onDoubleClick={() => FlyToCoordiantes(defualtSettings.center, defualtSettings.zoom)} />
                </Marker>
            </Map>
        </Container>
    )
}

const Image = props => {
    const { post, scaleFactor, delay } = props;

    const fadeInAnimation = useAnimation();

    useEffect(() => {
        fadeInAnimation.start({
            opacity: 100,
            transition: {
                duration: 25,
                ease: 'easeIn',
                delay: delay
            }
        })
    }, [])

    return (
        <motion.div className={'bg-gray-100 max-h-fit max-w-fit p-1 rounded hover:scale-110 hover:-translate-y-10 transform transition' + (scaleFactor === 0 ? 'hidden' : null)}
            animate={fadeInAnimation}
            initial={{ opacity: 0 }}>
            <img src={post.imageUrl} className='rounded' style={{ maxWidth: 200 * scaleFactor, maxHeight: 200 * scaleFactor }} />
        </motion.div>
    )
}

const mapStateToProps = state => ({
    posts: state.posts,
    location: state.location,
})

const mapDispatchToProps = dispatch => ({
    setPosts: posts => dispatch(setPosts(posts))
})

export default connect(mapStateToProps, mapDispatchToProps)(Map);