<template>
    <div class="controller active ds4">

        <div class="triggers">
            <span class="trigger left" data-key="L2" data-name="button-left-shoulder-bottom"></span>
            <span class="trigger right" data-key="R2" data-name="button-right-shoulder-bottom"></span>
            <span class="trigger-button left" data-name="button-left-shoulder-bottom-digital"></span>
            <span class="trigger-button right" data-name="button-right-shoulder-bottom-digital"></span>
            <span class="clear"></span>
        </div>
        <div class="bumpers">
            <span class="bumper left" data-key="L1" data-name="button-left-shoulder-top"></span>
            <span class="bumper right" data-key="R1" data-name="button-right-shoulder-top"></span>
            <span class="clear"></span>
        </div>
        <div class="touchpad" data-name="touch-pad"></div>
        <div class="quadrant p0"></div>
        <div class="meta" data-name="button-meta"></div>
        <div class="arrows">
            <span class="back" data-name="button-select"></span>
            <span class="start" data-name="button-start"></span>
            <span class="clear"></span>
        </div>
        <div class="abxy">
            <span class="button a Cross" data-key="Cross" data-name="button-1"></span>
            <span class="button b Circle " data-key="Circle" data-name="button-2"></span>
            <span class="button x Square" emit data-key="Square" data-name="button-3"></span>
            <span class="button y Triangle" data-key="Triangle" data-name="button-4"></span>
        </div>
        <div class="sticks">
            <span class="stick left" data-name="stick-1"
                style="margin-left: 0px; margin-top: 0px; transform: rotateX(0deg) rotateY(0deg);"></span>
            <span class="stick right" data-name="stick-2"
                style="margin-left: 0px; margin-top: 0px; transform: rotateX(0deg) rotateY(0deg);"></span>
        </div>
        <div class="wheels">
            <span class="wheel left" data-name="stick-1-wheel" style="transform: rotate(0deg);"></span>
            <span class="wheel right" data-name="stick-2-wheel" style="transform: rotate(0deg);"></span>
        </div>
        <div class="dpad">
            <span class="face up" data-name="button-dpad-top"></span>
            <span class="face down" data-name="button-dpad-bottom"></span>
            <span class="face left" data-name="button-dpad-left"></span>
            <span class="face right" data-name="button-dpad-right"></span>
        </div>
        <div class="fstick" data-name="arcade-stick"></div>
    </div>
</template>