import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { connect } from 'react-redux';
import ReactMapboxGl, { Marker } from 'react-mapbox-gl';
import Container from '../Container/Container';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = props => {
    const { posts, location } = props;

    const [scaleFactor, setScaleFactor] = useState(14 * 0.1);
    const mapRef = useRef();

    const onZoomChanged = (zoom) => {
        if (zoom < 5) {
            setScaleFactor(0);
            return;
        }

        setScaleFactor(zoom * 0.1)
    }

    const defualtSettings = useMemo(() => ({
        center: location,
        zoom: [14]
    }), []);
    const Map = useMemo(() => ReactMapboxGl({
        accessToken: 'pk.eyJ1IjoiaWRvbnYiLCJhIjoiY2tscnpsb2R1MGF1ZzJ2cDM1ZWVsbHQwMyJ9.vd9YaH0VyDnsJnjJbF8DIA',
    }), []);

    const FlyToCoordiantes = (coordinates, zoom) => {
        const { state: { map } } = mapRef.current;
        map.flyTo({ center: coordinates, zoom })
    }

    return (
        <Container>
            <Map
                center={location}
                zoom={defualtSettings.zoom}
                containerStyle={{
                    width: '100vw',
                    height: '100vh',
                }}
                onZoomEnd={(map, e) => onZoomChanged(map.getZoom())}
                ref={mapRef}
                style={'mapbox://styles/mapbox/streets-v9'}>
                {
                    posts.map((post, i) => {
                        return <Marker
                            onClick={() => {
                                console.log(post);
                            }}
                            className='cursor-pointer'
                            anchor='center'
                            coordinates={post.location.coordinates}
                            className='cursor-pointer'>
                            <Image post={post} delay={i} scaleFactor={scaleFactor} />
                        </Marker>
                    })
                }
                <Marker coordinates={defualtSettings.center} anchor='center'>
                    <div className=' bg-red-600 h-5 w-5 cursor-pointer z-10 hover:scale-125 transform transition' style={{ borderRadius: '50%' }}
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
        <motion.div className={'bg-gray-100 max-h-fit max-w-fit p-1 rounded hover:scale-110 hover:-translate-y-10 transform transition ' + (scaleFactor === 0 ? 'hidden' : null)}
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

export default connect(mapStateToProps, null)(Map);