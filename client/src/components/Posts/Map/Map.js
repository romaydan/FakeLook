import * as faker from 'faker';
import { useState, useMemo, useRef, useEffect } from 'react';
import { createFakePosts } from '../../../fake-data/fake.data';
import ReactMapboxGl, { Layer, Feature, Marker } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Container from '../Container/Container';
import { motion, useAnimation } from 'framer-motion';

const posts = createFakePosts();

const Map = props => {
    const [scaleFactor, setScaleFactor] = useState(14 * 0.1);
    const [zoom, setZoom] = useState([14]);
    const mapRef = useRef();

    const onZoomChanged = (zoom) => {
        if (zoom < 5) {
            setScaleFactor(0);
            return;
        }

        setScaleFactor(zoom * 0.1)
    }

    const viewport = useMemo(() => ({
        center: [34.8762222964216, 32.02693822368098],
        zoom: [15]
    }), [])
    const Map = useMemo(() => ReactMapboxGl({
        accessToken: 'pk.eyJ1IjoiaWRvbnYiLCJhIjoiY2tscnpsb2R1MGF1ZzJ2cDM1ZWVsbHQwMyJ9.vd9YaH0VyDnsJnjJbF8DIA',
    }), []);

    const FlyToCoordiantes = (coordinates, zoom) => {
        const { state: { map } } = mapRef.current;
        map.flyTo({ center: coordinates, zoom: zoom })
    }

    return (
        <Container>
            <Map
                center={viewport.center}
                zoom={zoom}
                containerStyle={{
                    width: '100%',
                    height: '100%',
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
                <Marker coordinates={viewport.center} anchor='center'>
                    <div className=' bg-red-600 h-5 w-5 cursor-pointer z-10 hover:scale-125 transform transition' style={{ borderRadius: '50%' }}
                        onDoubleClick={() => FlyToCoordiantes(viewport.center, zoom)} />
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

export default Map;