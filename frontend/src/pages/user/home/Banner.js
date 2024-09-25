import React from "react";
import Carousel from 'nuka-carousel';
import Icon from "@mdi/react";
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import './Banner.css';

const banners = [
    'https://m.media-amazon.com/images/I/61aURrton0L._SX3000_.jpg',
    'https://images-eu.ssl-images-amazon.com/images/G/31/img23/Beauty/TBS/GW/Skincare-Herofader-PC._CB598928078_.jpg',
    'https://images-eu.ssl-images-amazon.com/images/G/31/IMG20/Home/2023/BAU2023/ATFGW/Home_mela_july_3000x1200._CB598959250_.jpg',
    'https://images-eu.ssl-images-amazon.com/images/G/31/img2020/Vernac/2021/Gw-Hero/Mobile_tall_Hero_revision_3000x1200._CB604857279_.jpg',
    'https://images-eu.ssl-images-amazon.com/images/G/31/img23/Softlines_JWL_SH_GW_Assets/July_23/ATF/Unrec/YesBank/Shoes/Shoes_3000_2._CB598957948_.jpg',
    'https://images-eu.ssl-images-amazon.com/images/G/31/img21/Wireless/Shreyansh/BAU/Unrexc/D70978891_INWLD_BAU_Unrec_Uber_PC_Hero_3000x1200._CB594707876_.jpg'
];

function Banner() {
    return (
        <div className="banner">
            <div className="banner_carousel">
                <Carousel
                    autoplay
                    className="banner"
                    renderCenterLeftControls={({ previousSlide }) => (
                        <Icon
                            className="banner_control"
                            size={3}
                            path={mdiChevronLeft}
                            onClick={previousSlide}
                        />
                    )}
                    renderCenterRightControls={({ nextSlide }) => (
                        <Icon
                            className="banner_control"
                            size={3}
                            path={mdiChevronRight}
                            onClick={nextSlide}
                        />
                    )}
                    renderBottomCenterControls={() => null}
                >
                    {banners.map((bannerSrc, index) => (
                        <img key={index} alt={`Banner ${index + 1}`} src={bannerSrc} />
                    ))}
                </Carousel>
            </div>
        </div>
    );
}
export default Banner;