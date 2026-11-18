// Homepage hero: "the market, being watched".
// A faint field of points (the sites and feeds CIx watches), a slow radar sweep
// that makes some of them ping, occasional signal cards at the edges, and a
// cursor that works like a lens. Pauses off-screen; static for reduced motion.
// Add ?hero=classic to the URL to compare with the plain aurora background.
(function () {
    if (/[?&]hero=classic\b/.test(location.search)) return;
    var host = document.querySelector('.hero-modern-bg');
    var hero = document.querySelector('.hero-dark');
    if (!host || !hero) return;

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    var canvas = document.createElement('canvas');
    canvas.className = 'hero-signal-canvas';
    host.insertBefore(canvas, host.querySelector('.hero-noise'));
    var chipLayer = document.createElement('div');
    chipLayer.className = 'hero-signal-chips';
    host.appendChild(chipLayer);
    host.classList.add('has-signals');
    var ctx = canvas.getContext('2d');

    var COLORS = ['#818cf8', '#c084fc', '#38bdf8', '#34d399'];
    var CHIPS = [
        ['Pricing page changed', 8], ['New job post: VP Sales', 6], ['Changelog: AI assistant', 9],
        ['G2 review, 2★', 5], ['Webinar announced', 4], ['Partner page live', 6],
        ['Funding round', 7], ['Homepage repositioned', 8], ['Docs: new API', 6], ['Case study published', 5]
    ];

    var W = 0, H = 0, dpr = 1, nodes = [], center = { x: 0, y: 0 }, textBox = null;
    var mouse = { x: -9999, y: -9999, active: false };
    var sweep = 0, lastT = 0, running = false, visible = true, chipCount = 0, chipIdx = 0;

    function rand(a, b) { return a + Math.random() * (b - a); }

    function layout() {
        var r = host.getBoundingClientRect();
        W = r.width; H = r.height;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
        canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Keep the field clear around the headline block so text stays readable.
        var content = hero.querySelector('.hero-content');
        var cr = content ? content.getBoundingClientRect() : r;
        textBox = { x: cr.left - r.left, y: cr.top - r.top, w: cr.width, h: cr.height };
        center = { x: W / 2, y: textBox.y + textBox.h * 0.45 };

        var target = Math.round(Math.min(130, Math.max(45, (W * Math.min(H, 1000)) / 11000)));
        nodes = [];
        var tries = 0;
        while (nodes.length < target && tries < target * 30) {
            tries++;
            var x = rand(0, W), y = rand(0, Math.min(H, 1100));
            var ok = true;
            for (var i = 0; i < nodes.length; i++) {
                var dx = nodes[i].bx - x, dy = nodes[i].by - y;
                if (dx * dx + dy * dy < 46 * 46) { ok = false; break; }
            }
            if (!ok) continue;
            nodes.push({
                bx: x, by: y, x: x, y: y,
                ph: rand(0, Math.PI * 2), sp: rand(0.15, 0.45), amp: rand(2, 6),
                angle: Math.atan2(y - center.y, x - center.x),
                ping: 0, color: COLORS[(Math.random() * COLORS.length) | 0],
                fade: 1
            });
        }
        nodes.forEach(function (n) { n.fade = clearance(n.bx, n.by); });
    }

    // 0 inside the headline block, rising to 1 well outside it.
    function clearance(x, y) {
        if (!textBox) return 1;
        var cx = textBox.x + textBox.w / 2, cy = textBox.y + textBox.h * 0.42;
        var rx = textBox.w * 0.42, ry = textBox.h * 0.5;
        var d = Math.sqrt(Math.pow((x - cx) / rx, 2) + Math.pow((y - cy) / ry, 2));
        return Math.max(0.12, Math.min(1, (d - 0.7) / 0.8));
    }

    function hexToRgba(hex, a) {
        var n = parseInt(hex.slice(1), 16);
        return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
    }

    function angDiff(a, b) {
        var d = a - b;
        while (d > Math.PI) d -= Math.PI * 2;
        while (d < -Math.PI) d += Math.PI * 2;
        return d;
    }

    function showChip(n) {
        if (chipCount >= 2 || W < 1024) return;
        if (Math.abs(n.x - W / 2) < textBox.w * 0.42 || n.y > 900 || n.y < 90) return;
        var c = CHIPS[chipIdx++ % CHIPS.length];
        var el = document.createElement('div');
        el.className = 'hero-signal-chip';
        el.style.setProperty('--c', n.color);
        el.innerHTML = '<span class="hsc-dot"></span><span class="hsc-text"></span><span class="hsc-score"></span>';
        el.querySelector('.hsc-text').textContent = c[0];
        el.querySelector('.hsc-score').textContent = c[1] + '/10';
        var left = n.x + 14, top = n.y - 14;
        if (left + 240 > W) left = n.x - 254;
        el.style.left = left + 'px'; el.style.top = top + 'px';
        chipLayer.appendChild(el);
        chipCount++;
        requestAnimationFrame(function () { el.classList.add('in'); });
        setTimeout(function () { el.classList.remove('in'); }, 3400);
        setTimeout(function () { el.remove(); chipCount--; }, 4100);
    }

    function draw(t) {
        var dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 0.016;
        lastT = t;
        var prevSweep = sweep;
        sweep = (sweep + dt * (Math.PI * 2 / 10)) % (Math.PI * 2);

        ctx.clearRect(0, 0, W, H);

        // Radar sweep: a soft wedge trailing the leading edge.
        var R = Math.max(W, H) * 0.75;
        var slices = 22, width = 0.75;
        for (var s = 0; s < slices; s++) {
            var a1 = sweep - (s + 1) * (width / slices), a2 = sweep - s * (width / slices);
            var alpha = 0.12 * Math.pow(1 - s / slices, 1.5);
            var g = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, R);
            g.addColorStop(0, 'rgba(129,140,248,' + alpha + ')');
            g.addColorStop(0.55, 'rgba(129,140,248,' + alpha * 0.5 + ')');
            g.addColorStop(1, 'rgba(129,140,248,0)');
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.moveTo(center.x, center.y); ctx.arc(center.x, center.y, R, a1, a2); ctx.closePath(); ctx.fill();
        }
        // Leading edge line
        var lg = ctx.createLinearGradient(center.x, center.y, center.x + Math.cos(sweep) * R, center.y + Math.sin(sweep) * R);
        lg.addColorStop(0, 'rgba(165,180,252,0)'); lg.addColorStop(0.25, 'rgba(165,180,252,.32)'); lg.addColorStop(1, 'rgba(165,180,252,0)');
        ctx.strokeStyle = lg; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(center.x, center.y); ctx.lineTo(center.x + Math.cos(sweep) * R, center.y + Math.sin(sweep) * R); ctx.stroke();

        // Move nodes and trigger pings as the sweep passes.
        var time = t / 1000;
        for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            n.x = n.bx + Math.cos(time * n.sp + n.ph) * n.amp;
            n.y = n.by + Math.sin(time * n.sp * 1.3 + n.ph) * n.amp;
            var before = angDiff(n.angle, prevSweep), after = angDiff(n.angle, sweep);
            if (before > 0 && after <= 0 && Math.random() < 0.16 && n.fade > 0.5) {
                n.ping = 1;
                if (Math.random() < 0.4) showChip(n);
            }
            if (n.ping > 0) n.ping = Math.max(0, n.ping - dt / 1.6);
        }

        // Connections
        var maxD = 128, mx = mouse.x, my = mouse.y, lens = 190;
        for (var a = 0; a < nodes.length; a++) {
            var na = nodes[a];
            for (var b = a + 1; b < nodes.length; b++) {
                var nb = nodes[b];
                var dx = na.x - nb.x, dy = na.y - nb.y, d2 = dx * dx + dy * dy;
                if (d2 > maxD * maxD) continue;
                var d = Math.sqrt(d2), o = (1 - d / maxD) * 0.2 * Math.min(na.fade, nb.fade);
                if (mouse.active) {
                    var mdx = (na.x + nb.x) / 2 - mx, mdy = (na.y + nb.y) / 2 - my;
                    var md = Math.sqrt(mdx * mdx + mdy * mdy);
                    if (md < lens) o += (1 - md / lens) * 0.22 * Math.min(na.fade, nb.fade);
                }
                ctx.strokeStyle = 'rgba(148,163,184,' + o.toFixed(3) + ')';
                ctx.beginPath(); ctx.moveTo(na.x, na.y); ctx.lineTo(nb.x, nb.y); ctx.stroke();
            }
        }

        // Cursor lens: lines to the nearest points and a soft glow.
        if (mouse.active) {
            var near = [];
            for (var k = 0; k < nodes.length; k++) {
                var nk = nodes[k], ddx = nk.x - mx, ddy = nk.y - my, dd = Math.sqrt(ddx * ddx + ddy * ddy);
                if (dd < lens) near.push([dd, nk]);
            }
            near.sort(function (p, q) { return p[0] - q[0]; });
            near.slice(0, 6).forEach(function (p) {
                var o2 = (1 - p[0] / lens) * 0.45 * p[1].fade;
                ctx.strokeStyle = 'rgba(165,180,252,' + o2.toFixed(3) + ')';
                ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(p[1].x, p[1].y); ctx.stroke();
            });
            var mg = ctx.createRadialGradient(mx, my, 0, mx, my, lens);
            mg.addColorStop(0, 'rgba(129,140,248,0.10)'); mg.addColorStop(1, 'rgba(129,140,248,0)');
            ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(mx, my, lens, 0, Math.PI * 2); ctx.fill();
        }

        // Points and pings
        for (var m = 0; m < nodes.length; m++) {
            var p0 = nodes[m], base = 0.5 * p0.fade, rad = 1.6;
            if (mouse.active) {
                var qx = p0.x - mx, qy = p0.y - my, qd = Math.sqrt(qx * qx + qy * qy);
                if (qd < lens) { base += (1 - qd / lens) * 0.55 * p0.fade; rad += (1 - qd / lens) * 0.9; }
            }
            if (p0.ping > 0) {
                var e = 1 - p0.ping;
                ctx.strokeStyle = hexToRgba(p0.color, (p0.ping * 0.8).toFixed(3));
                ctx.lineWidth = 1.2;
                ctx.beginPath(); ctx.arc(p0.x, p0.y, 3 + e * 22, 0, Math.PI * 2); ctx.stroke();
                ctx.lineWidth = 1;
                ctx.fillStyle = hexToRgba(p0.color, Math.min(1, 0.35 + p0.ping).toFixed(3));
                ctx.beginPath(); ctx.arc(p0.x, p0.y, rad + 1.2 * p0.ping, 0, Math.PI * 2); ctx.fill();
            } else {
                ctx.fillStyle = 'rgba(203,213,225,' + base.toFixed(3) + ')';
                ctx.beginPath(); ctx.arc(p0.x, p0.y, rad, 0, Math.PI * 2); ctx.fill();
            }
        }
    }

    function loop(t) {
        if (!running) return;
        draw(t);
        requestAnimationFrame(loop);
    }
    function start() { if (running || reduce) return; running = true; lastT = 0; requestAnimationFrame(loop); }
    function stop() { running = false; }

    layout();
    if (reduce) { draw(0); } else { start(); }

    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () { layout(); if (reduce) draw(0); }, 150);
    });
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
            visible = entries[0].isIntersecting;
            if (visible && !document.hidden) start(); else stop();
        }).observe(hero);
    }
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) stop(); else if (visible) start();
    });

    if (finePointer && !reduce) {
        hero.addEventListener('pointermove', function (e) {
            var r = host.getBoundingClientRect();
            mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;
            // Gentle parallax on the aurora for depth.
            var px = (e.clientX / window.innerWidth - 0.5), py = (e.clientY / window.innerHeight - 0.5);
            host.style.setProperty('--px', (px * 26).toFixed(1) + 'px');
            host.style.setProperty('--py', (py * 18).toFixed(1) + 'px');
        });
        hero.addEventListener('pointerleave', function () { mouse.active = false; mouse.x = mouse.y = -9999; });
    }
})();
