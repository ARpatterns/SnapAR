# AR Patterns using Snap AR
AR patterns and scenarios created with Lens Studio.

## Technology Platform: Lens Studio

<img src="graphics/lens_studio_logo.png" width="120" align="right">

- _Software Stack_: Lens Studio
- _Supported Devices_: Windows, MacOS
- _Editor Environment_: Lens Studio 
- _Development Method_: no-code or scripting using triggers to invoke behavior


## Lens Studio

[Lens Studio](https://ar.snap.com/lens-studio) is an AR development platform for creating AR experiences for Snapchat, Spectacles, mobile and web experiences. It is part of the Snap AR ecosystem.

---

## Basic AR Patterns

### Segment Overlay
<div align="center">
    <img src="dragon_snacks/graphics/dragon_left_gesture_gameplay.gif" width="150"/>
    <img src="ocean_clean-up/graphics/scissors_gesture_gameplay.gif" width="144"/>
</div>

The dragon head and the scissors are overlaid over the hand. The mouth and the scissors can be opened and closed when performing the respective gestures.

* _Behavioral Patterns_: Complementary Reactions, Continuous Evaluation, Instant Reaction, Chain Reaction
* _Augmentation Patterns_: Segment Overlay
* _Project Link_: [Dragon Snacks](dragon_snacks) & [Ocean Clean-Up](ocean_clean-up) (These projects contain the whole scenario, not just the AR pattern.)

### Superimposition
<div align="center">
    <img src="puppet_dance/graphics/skeleton_tracking.gif" width="150"/>
</div>

The skeleton is overlaid over the hand. It matches the hand's position and orientation.

* _Behavioral Patterns_: Continuous Evaluation
* _Augmentation Patterns_: Superimposition
* _Project Link_: [Puppet Dance](puppet_dance) (This project contains the whole scenario, not just the AR pattern.)

### Anchored Supplement
<div align="center">
    <img src="ocean_clean-up/graphics/camera_gesture_gameplay.gif" width="150"/>
</div>

The camera is attached to the hand at a fixed position. It can be triggered by performing the respective gesture.

* _Behavioral Patterns_: Continuous Evaluation
* _Augmentation Patterns_: Superimposition
* _Project Link_: [Ocean Clean-Up](ocean_clean-up) (This project contains the whole scenario, not just the AR pattern.)

## Scenarios of applied AR Patterns

### Dragon Snacks
<div align="center">
    <img src="dragon_snacks/graphics/gameplay.gif" width="150"/>
</div>

In this hand gesture game, the hands imitate dragons. They need to eat the food falling from the sky, and avoid the bombs.

* _Behavioral Patterns_: Complementary Reactions, Conditional Reaction, Continuous Evaluation, Instant Reaction, Timed Reaction
* _Augmentation Patterns_: Segment Overlay
* _Project Link_: [Dragon Snacks](dragon_snacks)

### Puppet Dance
<div align="center">
    <img src="puppet_dance/graphics/gameplay.gif" width="150"/>
</div>

In this hand gesture game, the hands represent the pose of the puppet. The controlled puppet needs to match the pose of the falling puppet in order to score at the dance contest.

* _Behavioral Patterns_: Complementary Reactions, Conditional Reaction, Continuous Evaluation
* _Augmentation Patterns_: Superimposition
* _Project Link_: [Puppet Dance](puppet_dance)


### Ocean Clean-Up
<div align="center">
    <img src="ocean_clean-up/graphics/gameplay.gif" width="150"/>
</div>

In this hand gesture game, the hands are used to control the scissors and camera. They are needed to save the fish from being picked up by the hook, and instead trick the hook into picking up the trash from the sea floor.

* _Behavioral Patterns_: Complementary Reactions, Chain Reaction, Continuous Evaluation
* _Augmentation Patterns_: Segment Overlay, Anchored Supplement
* _Project Link_: [Ocean Clean-Up](ocean_clean-up)

## Credits
All the games were created as part of Martina Kessler's Master's thesis at [GTC](https://gtc.inf.ethz.ch).

### Contributions
- Martina Kessler: implementation
- [Dr. Julia Chatain](https://juliachatain.com): supervision & graphics
- Dr. Fabio Zünd: supervision