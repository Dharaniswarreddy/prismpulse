const canvas = document.getElementById("hero-canvas");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas && !prefersReducedMotion && window.THREE) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.z = 13;

  const group = new THREE.Group();
  scene.add(group);

  const geometry = new THREE.IcosahedronGeometry(1, 1);
  const colors = [0x37f2d2, 0x46a4ff, 0x8ab6ff];

  for (let i = 0; i < 16; i += 1) {
    const material = new THREE.MeshStandardMaterial({
      color: colors[i % colors.length],
      metalness: 0.4,
      roughness: 0.2,
      transparent: true,
      opacity: 0.74
    });

    const mesh = new THREE.Mesh(geometry, material);
    const ring = 4 + Math.random() * 9;
    const angle = (i / 16) * Math.PI * 2;
    mesh.position.set(
      Math.cos(angle) * ring + (Math.random() - 0.5) * 2,
      Math.sin(angle) * (ring * 0.45) + (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 4
    );
    mesh.scale.setScalar(0.28 + Math.random() * 0.7);
    mesh.userData.rotationSpeed = 0.003 + Math.random() * 0.012;
    group.add(mesh);
  }

  const ambientLight = new THREE.AmbientLight(0x80a3ff, 1.1);
  const pointLight = new THREE.PointLight(0x65edff, 2.3, 40);
  pointLight.position.set(5, 6, 8);
  scene.add(ambientLight, pointLight);

  let targetX = 0;
  let targetY = 0;
  window.addEventListener("pointermove", (event) => {
    targetX = (event.clientX / window.innerWidth - 0.5) * 0.7;
    targetY = (event.clientY / window.innerHeight - 0.5) * 0.5;
  });

  const animate = () => {
    group.rotation.y += 0.0018;
    group.rotation.x += 0.0008;

    group.rotation.y += (targetX - group.rotation.y) * 0.01;
    group.rotation.x += (targetY - group.rotation.x) * 0.01;

    group.children.forEach((mesh) => {
      mesh.rotation.x += mesh.userData.rotationSpeed;
      mesh.rotation.y += mesh.userData.rotationSpeed * 0.8;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

const revealElements = document.querySelectorAll(".section, .hero, .site-footer");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((element) => {
  element.classList.add("reveal");
  revealObserver.observe(element);
});

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const box = card.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width;
    const py = (event.clientY - box.top) / box.height;
    const tiltX = (0.5 - py) * 10;
    const tiltY = (px - 0.5) * 10;
    card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = contactForm.querySelector("button");
    const status = contactForm.querySelector(".form-status");
    const originalText = button.textContent;
    const formData = new FormData(contactForm);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      goals: String(formData.get("goals") || "").trim()
    };

    button.textContent = "Sending...";
    button.disabled = true;

    if (status) {
      status.textContent = "";
    }

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Failed to save lead");
      }

      button.textContent = "Brief Sent";
      if (status) {
        status.textContent = "Thanks, your project brief was saved successfully.";
      }
      contactForm.reset();
    } catch (error) {
      button.textContent = "Try Again";
      if (status) {
        status.textContent = "Something went wrong. Please try again.";
      }
    }

    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 1700);
  });
}
