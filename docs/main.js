import { dialogueData, scaleFactor } from "./constants.js";
import k from "./kaboomCtx.js";
import { displayDialogue, setCamScale } from "./utils.js";

k.loadSprite("spritesheet", "../public/colored_packed.png",{
	sliceX: 49,
	sliceY: 22,
	anims: {
		"idle-down" : 361,
		"walk-down" : { from: 362, to: 364, loop: true, speed:8},
		"idle-side" : 361,
		"walk-side" : { from: 362, to: 364, loop: true, speed:8},
		"idle-up" : 361,
		"walk-up" : { from: 362, to: 364, loop: true, speed:8}
	}

});

k.loadSprite("map", "../public/map.png");

k.setBackground(k.Color.fromHex("#462d3d"));

k.scene("main", async () => {
	const mapData = await(await fetch("../public/map.json")).json();
	const layers = mapData.layers;

	const map = k.add([
		k.sprite("map"),
		k.pos(0),
		k.scale(scaleFactor)
	]);

	const player = k.make([
		k.sprite("spritesheet", {anim: "idle-down"}),
		k.area({
			shape: new k.Rect(k.vec2(0,3), 10, 10),
		}),
		k.body(),
		k.anchor("center"),
		k.pos(),
		k.scale(scaleFactor),
		{
			speed: 250,
			direction: "down",
			isInDialogue: false,
		},
		"player",
	]);

	const preferredLanguage = localStorage.getItem('preferredLanguage') || 'en';

	player.isInDialogue = true;
	displayDialogue(dialogueData[preferredLanguage]["Start"], () => (player.isInDialogue = false));

	for (const layer of layers)
	{
		if (layer.name === "boundaries")
		{
			for (const boundary of layer.objects)
			{
				map.add([
					k.area({
						shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
					}),
					k.body({isStatic: true}),
					k.pos(boundary.x, boundary.y),
					boundary.name,
				]);

				if (boundary.name)
				{
					player.onCollide(boundary.name, () => {
						player.isInDialogue = true;
						displayDialogue(dialogueData[preferredLanguage][boundary.name], () => (player.isInDialogue = false));
					})
				}
			}
			continue;
		}

		if (layer.name === "spawnpoint")
		{
			for (const entity of layer.objects)
			{
				if (entity.name === "player")
				{
					player.pos = k.vec2(
						(map.pos.x + entity.x) * scaleFactor,
						(map.pos.y + entity.y) * scaleFactor
					);

					k.add(player);
					continue;
				}
			}
		}
	}

	setCamScale(k);

	k.onResize(() => {
		setCamScale(k);
	});

	k.onUpdate(() => {
		k.camPos(player.pos.x, player.pos.y + 50);
	})

	k.onMouseDown((mouseBtn) => {
		if (mouseBtn !== "left" || player.isInDialogue) return;

		const worldMousePos = k.toWorld(k.mousePos());
		player.moveTo(worldMousePos, player.speed);

		if (worldMousePos.x < player.pos.x)
			player.flipX = true;
		else
			player.flipX = false;
		if (player.curAnim() !== "walk-down")
		{

			player.play("walk-down");
		}
	});

	k.onMouseRelease(() => {
		player.play("idle-down");
	})
});

k.go("main");