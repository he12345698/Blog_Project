import React from 'react';
import styles from '../styles/components/DarkLightSwitch.css'

const DarkLightSwitch = () => {

    return (
        <>
            {/* <input className={styles["dark-light"]} type="checkbox" id="dark-light" name="dark-light" />
            <label for="dark-light" className={styles["label"]}></label>

            <div className={["light-back"]}></div> */}
            	<input class="dark-light" type="checkbox" id="dark-light" name="dark-light"/>
  	<label for="dark-light"></label>

  	<div class="light-back"></div>
    <div className='logo'></div>
    
        </>
    );
}

export default DarkLightSwitch;