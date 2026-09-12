import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function animateHeroTitle() {
	const title = document.querySelector<HTMLElement>("[data-hero-title]");
	if (!title) return;

	const lines = title.querySelectorAll<HTMLElement>("span.block");

	gsap.set(title, { opacity: 1 });
	gsap.from(lines, {
		xPercent: (i) => (i === 0 ? -100 : 100),
		opacity: 0,
		duration: 1.4,
		ease: "expo.out",
		stagger: 0.15,
		delay: 0.2,
	});
}

function animateReveals() {
	const els = document.querySelectorAll<HTMLElement>("[data-reveal]");

	els.forEach((el) => {
		const type = el.dataset.reveal ?? "fade-up";
		const delay = parseFloat(el.dataset.revealDelay ?? "0");

		const from: gsap.TweenVars = { opacity: 0 };
		if (type === "fade-up") from.y = 40;
		if (type === "fade-down") from.y = -20;
		if (type === "fade-left") from.x = 60;
		if (type === "fade-right") from.x = -60;

		gsap.fromTo(
			el,
			from,
			{
				opacity: 1,
				x: 0,
				y: 0,
				duration: 1.1,
				ease: "power3.out",
				delay,
				scrollTrigger: {
					trigger: el,
					start: "top 85%",
					toggleActions: "play none none reverse",
				},
			},
		);
	});
}

function animateProductScroll() {
	const section = document.querySelector<HTMLElement>("[data-products]");
	if (!section) return;

	const pin = section.querySelector<HTMLElement>("[data-products-pin]");
	const texts = section.querySelectorAll<HTMLElement>("[data-product-text]");
	const images = section.querySelectorAll<HTMLElement>("[data-product-image]");

	if (!pin || texts.length < 2 || images.length !== texts.length) return;

	const mm = gsap.matchMedia();

	mm.add("(min-width: 1024px)", () => {
		gsap.set(texts, { yPercent: (i) => (i === 0 ? 0 : 100), y: 0 });
		gsap.set(images, { yPercent: (i) => (i === 0 ? 0 : -100), y: 0 });

		const dur = 1;
		const hold = 0.3;
		const step = dur + hold;

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: section,
				pin: pin,
				start: "top top",
				end: "bottom bottom",
				scrub: 0.5,
			},
		});

		// Objeto dummy para hold real (garantiza que el timeline consuma duración)
		const dummy = { v: 0 };

		// Hold inicial
		tl.to(dummy, { v: 1, duration: hold });

		// Transiciones + hold del entrante
		for (let i = 0; i < texts.length - 1; i++) {
			const start = hold + i * step;

			tl.to(
				texts[i],
				{ yPercent: -100, duration: dur, ease: "power2.inOut" },
				start,
			)
				.to(
					images[i],
					{ yPercent: 100, duration: dur, ease: "power2.inOut" },
					start,
				)
				.to(
					texts[i + 1],
					{ yPercent: 0, duration: dur, ease: "power2.inOut" },
					start,
				)
				.to(
					images[i + 1],
					{ yPercent: 0, duration: dur, ease: "power2.inOut" },
					start,
				);
		}

		// Hold final (Max visible al terminar)
		tl.to(dummy, { v: 2, duration: hold });
	});
}

function animateMarquees() {
	const marquees = document.querySelectorAll<HTMLElement>("[data-marquee]");

	marquees.forEach((marquee) => {
		const track = marquee.querySelector<HTMLElement>("[data-marquee-track]");
		if (!track) return;

		const speed = parseFloat(marquee.dataset.marqueeSpeed ?? "40");
		const distance = track.scrollWidth / 3;

		gsap.to(track, {
			x: -distance,
			duration: distance / speed,
			ease: "none",
			repeat: -1,
		});
	});
}

export function initAnimations() {
	if (typeof window === "undefined") return;

	const run = () => {
		animateHeroTitle();
		animateReveals();
		animateProductScroll();
		animateMarquees();
		ScrollTrigger.refresh();
	};

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", run, { once: true });
	} else {
		run();
	}
}
