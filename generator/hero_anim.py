# Animated "engagement" panel for the Hopsig hero. CSS-only, 15 s loop, five phases of 3 s.
MONO = "'IBM Plex Mono', monospace"
T = 15.0
def pct(t): return str(round(t / T * 100, 3)) + '%'

def tokens(dark):
    if dark: return dict(bg="#12161C", border="#262C34", text="#E7ECEF", dim="#939A96", hair="#262C34", acc="#C6F24E", accInk="#0E1116", up="#262C34", done="#545A60", bar="#3C424A", sub="#B9BFB6")
    return dict(bg="#FFFFFF", border="#D6DAD2", text="#0E1116", dim="#545A60", hair="#EAECE6", acc="#3F6B1F", accInk="#F7F8F4", up="#EAECE6", done="#939A96", bar="#D6DAD2", sub="#3C424A")

def kf_layer(name, i):
    t0 = 3 * i
    return ('@keyframes ' + name + '{0%{opacity:0;transform:translateY(8px)}' + pct(t0) + '{opacity:0;transform:translateY(8px)}' + pct(t0 + .4) + '{opacity:1;transform:translateY(0)}' + pct(t0 + 2.7) + '{opacity:1;transform:translateY(0)}' + pct(t0 + 3) + '{opacity:0;transform:translateY(-6px)}100%{opacity:0;transform:translateY(-6px)}}')
def kf_item(name, t_in, dur=.35):
    return ('@keyframes ' + name + '{0%{opacity:0;transform:translateY(6px)}' + pct(t_in) + '{opacity:0;transform:translateY(6px)}' + pct(t_in + dur) + '{opacity:1;transform:translateY(0)}100%{opacity:1;transform:translateY(0)}}')
def kf_width(name, t_in, w0, w1, dur=1.1):
    return ('@keyframes ' + name + '{0%{width:' + w0 + '}' + pct(t_in) + '{width:' + w0 + ';animation-timing-function:cubic-bezier(.2,.7,.2,1)}' + pct(t_in + dur) + '{width:' + w1 + '}100%{width:' + w1 + '}}')
def kf_type(name, t_in, dur, steps):
    return ('@keyframes ' + name + '{0%{width:0}' + pct(t_in) + '{width:0;animation-timing-function:steps(' + str(steps) + ',end)}' + pct(t_in + dur) + '{width:100%}100%{width:100%}}')
def kf_fill(name, t_in, c0, c1):
    return ('@keyframes ' + name + '{0%{background:' + c0 + '}' + pct(t_in) + '{background:' + c0 + '}' + pct(t_in + .15) + '{background:' + c1 + '}100%{background:' + c1 + '}}')
def kf_seg(name, i, up, cur, done):
    t0 = 3 * i
    a = '@keyframes ' + name + '{0%{background:' + (cur if i == 0 else up) + '}'
    if i > 0: a += pct(t0) + '{background:' + up + '}' + pct(t0 + .05) + '{background:' + cur + '}'
    a += pct(t0 + 3) + '{background:' + cur + '}' + pct(min(T, t0 + 3.05)) + '{background:' + done + '}100%{background:' + done + '}}'
    return a
def kf_stroke(name, t_in, dur=.6):
    return ('@keyframes ' + name + '{0%{stroke-dashoffset:40}' + pct(t_in) + '{stroke-dashoffset:40}' + pct(t_in + dur) + '{stroke-dashoffset:0}100%{stroke-dashoffset:0}}')
def kf_fade(name, t_in, dur=.3):
    return ('@keyframes ' + name + '{0%{opacity:0}' + pct(t_in) + '{opacity:0}' + pct(t_in + dur) + '{opacity:1}100%{opacity:1}}')

PHASES = [("Day 0", "The call"), ("Day 3", "The scope"), ("Day 10", "People in"), ("Week 6", "Measured"), ("Fortnightly", "The review")]

def panel(dark=True, mode="anim", static_phase=2, w=568, h=380, prefix="hm"):
    """mode='anim' → CSS-animated loop; mode='static' → one phase, final values, no animation."""
    k = tokens(dark); P = prefix
    anim = (mode == "anim")
    css = ['.' + P + ' *{box-sizing:border-box}', '.' + P + '{font-family:"Space Grotesk",sans-serif}']
    def A(name):  # animation shorthand
        return ('animation:' + name + ' ' + str(T) + 's linear infinite;') if anim else ''
    def layer_style(i):
        if anim: return 'position:absolute;inset:0;opacity:0;' + A(P + 'L' + str(i))
        return 'position:absolute;inset:0;opacity:' + ('1' if i == static_phase else '0') + ';'
    def item_style(name, t_in, dur=.35):
        if anim:
            css.append(kf_item(name, t_in, dur)); return 'opacity:0;' + A(name)
        return ''
    lab = 'font-family:' + MONO + ';font-size:11px;letter-spacing:.14em;text-transform:uppercase;'
    mono = 'font-family:' + MONO + ';'
    # header + rail
    head = ('<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid ' + k["hair"] + ';padding-bottom:10px;height:24px;"><div style="' + lab + 'color:' + k["dim"] + ';">Engagement &#183; [Client]</div><div style="position:relative;width:200px;height:14px;">')
    for i, (d, n) in enumerate(PHASES):
        if anim: css.append(kf_layer(P + 'L' + str(i), i))
        head += '<div style="position:absolute;right:0;top:0;' + lab + 'color:' + k["acc"] + ';white-space:nowrap;' + layer_style(i) + '">' + d + ' &#183; ' + n + '</div>'
    head += '</div></div>'
    rail = '<div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px;margin:12px 0 14px;">'
    for i in range(5):
        if anim:
            css.append(kf_seg(P + 'S' + str(i), i, k["up"], k["acc"], k["done"])); bg = k["up"]; a = A(P + 'S' + str(i))
        else:
            bg = k["done"] if i < static_phase else (k["acc"] if i == static_phase else k["up"]); a = ''
        rail += '<div style="height:3px;border-radius:3px;background:' + bg + ';' + a + '"></div>'
    rail += '</div>'
    # ---- phase 0: the call
    t0 = 0
    if anim:
        css.append(kf_type(P + 'T', t0 + .35, 1.5, 46)); css.append('@keyframes ' + P + 'blink{0%,49%{border-color:' + k["acc"] + '}50%,100%{border-color:transparent}}'); css.append(kf_fill(P + 'tick', t0 + 2.2, 'transparent', k["acc"]))
    brief = ('<div style="' + mono + 'font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:' + k["dim"] + ';">09:14 GMT &#183; 30 min &#183; you and the people who would do the work</div>'
             '<div style="margin-top:10px;font-size:19px;font-weight:600;letter-spacing:-.03em;line-height:26px;color:' + k["text"] + ';"><span style="display:inline-block;white-space:nowrap;overflow:hidden;vertical-align:bottom;max-width:100%;border-right:2px solid ' + k["acc"] + ';padding-right:3px;' + (('width:0;' + A(P + 'T') + 'animation:' + P + 'T ' + str(T) + 's linear infinite,' + P + 'blink 1s step-end infinite;') if anim else '') + '">&#8220;Rebuild the ingest pipeline. Our team runs it after.&#8221;</span></div>'
             '<div style="margin-top:22px;display:flex;flex-direction:column;gap:9px;' + mono + 'font-size:12px;color:' + k["sub"] + ';">')
    for j, (name, on) in enumerate([("Engineers embedded in your team", False), ("A product, scoped and built", True), ("Data &amp; AI system, measured", False)]):
        box = 'width:12px;height:12px;border-radius:3px;border:1px solid ' + (k["acc"] if on else k["bar"]) + ';' + (('background:' + k["acc"] + ';') if (on and not anim) else '') + ((A(P + 'tick')) if (on and anim) else '')
        brief += '<div style="display:flex;align-items:center;gap:10px;' + item_style(P + 'b' + str(j), t0 + .9 + .25 * j) + '"><div style="' + box + '"></div><span' + ((' style="color:' + k["text"] + ';"') if on else '') + '>' + name + '</span></div>'
    brief += '</div>'
    # ---- phase 1: the scope
    t1 = 3
    rows1 = [("In", "Ingest service &#183; DLQ + replay &#183; runbook", k["text"]), ("Out", "Warehouse schema &#183; dashboards", k["dim"]), ("Terms", "6 weeks, fixed &#183; [YOUR RATE] &#183; NET 14", k["text"])]
    scope = '<div style="display:flex;justify-content:space-between;align-items:center;"><div style="font-size:19px;font-weight:600;letter-spacing:-.03em;color:' + k["text"] + ';">Scope v1</div><div style="' + lab + 'color:' + k["acc"] + ';border:1px solid ' + k["acc"] + ';border-radius:6px;padding:5px 8px;' + item_style(P + 'sg', t1 + 1.9, .25) + '">Signed &#183; day 3</div></div><div style="margin-top:14px;display:flex;flex-direction:column;">'
    for j, (a, b, c) in enumerate(rows1):
        scope += '<div style="display:grid;grid-template-columns:52px 1fr;gap:12px;padding:7px 0;border-top:1px solid ' + k["hair"] + ';' + mono + 'font-size:12px;line-height:18px;' + item_style(P + 'r' + str(j), t1 + .5 + .35 * j) + '"><span style="' + lab + 'color:' + k["dim"] + ';padding-top:3px;">' + a + '</span><span style="color:' + c + ';">' + b + '</span></div>'
    scope += '<div style="border-top:1px solid ' + k["hair"] + ';padding-top:10px;font-size:12px;line-height:18px;color:' + k["dim"] + ';' + item_style(P + 'r3', t1 + 1.6) + '">Two pages. Before you pay anything.</div></div>'
    # ---- phase 2: people in
    t2 = 6
    people = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">'
    for j, (ini, role, yrs) in enumerate([("A.K.", "Backend", "11 yrs"), ("S.R.", "Data", "9 yrs")]):
        people += ('<div style="display:flex;align-items:center;gap:10px;border:1px solid ' + k["hair"] + ';border-radius:8px;padding:9px 10px;' + item_style(P + 'p' + str(j), t2 + .4 + .3 * j) + '"><div style="width:28px;height:28px;border-radius:8px;box-shadow:inset 0 0 0 1px ' + k["bar"] + ';color:' + k["text"] + ';' + mono + 'font-size:10px;font-weight:500;display:flex;align-items:center;justify-content:center;">' + ini + '</div><div><div style="font-size:13px;font-weight:600;letter-spacing:-.01em;color:' + k["text"] + ';">' + role + ' &#183; ' + yrs + '</div><div style="' + mono + 'font-size:10px;color:' + k["dim"] + ';">in your standup 09:30 GMT</div></div></div>')
    people += '</div><div style="margin-top:14px;' + mono + 'font-size:11px;line-height:20px;color:' + k["sub"] + ';">'
    for j, (hsh, msg, tm) in enumerate([("a41f2c", "ingest: replace cron with queue consumer", "day 10 &#183; 14:02"), ("9be0d7", "dlq: replay endpoint + tests", "day 11 &#183; 10:47"), ("c07a11", "runbook: on-call steps, rollback", "day 12 &#183; 16:15")]):
        people += '<div style="display:grid;grid-template-columns:52px 1fr auto;gap:10px;' + item_style(P + 'c' + str(j), t2 + 1.2 + .4 * j, .3) + '"><span style="color:' + k["dim"] + ';">' + hsh + '</span><span style="color:' + k["text"] + ';white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + msg + '</span><span style="color:' + k["dim"] + ';">' + tm + '</span></div>'
    people += '</div>'
    # ---- phase 3: measured
    t3 = 9
    if anim:
        css.append(kf_width(P + 'w1', t3 + .6, '100%', '6%', 1.3)); css.append(kf_width(P + 'w2', t3 + 1.0, '100%', '0%', 1.1)); css.append(kf_fade(P + 'n1', t3 + 1.6)); css.append(kf_fade(P + 'n2', t3 + 1.9))
    def metric(title, before, after, wname, nname, d):
        return ('<div style="' + item_style(P + wname + 'i', t3 + d) + '"><div style="display:flex;justify-content:space-between;align-items:baseline;"><div style="font-size:13px;font-weight:600;letter-spacing:-.01em;color:' + k["text"] + ';">' + title + '</div><div style="' + mono + 'font-size:12px;color:' + k["dim"] + ';">' + before + ' &#8594; <span style="color:' + k["acc"] + ';' + (('opacity:0;' + A(P + nname)) if anim else '') + '">' + after + '</span></div></div>'
                '<div style="margin-top:8px;height:8px;border-radius:3px;background:' + k["bar"] + ';overflow:hidden;position:relative;"><div style="position:absolute;left:0;top:0;height:100%;border-radius:3px;background:' + k["acc"] + ';width:' + ('100%' if anim else ('6%' if wname == 'w1' else '0%')) + ';' + A(P + wname) + '"></div></div></div>')
    measured = ('<div style="font-size:19px;font-weight:600;letter-spacing:-.03em;line-height:24px;color:' + k["text"] + ';">First increment, live.</div><div style="' + mono + 'font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:' + k["dim"] + ';margin-top:4px;">Measured before we claim it improved</div>'
                '<div style="margin-top:18px;display:flex;flex-direction:column;gap:16px;">' + metric("Nightly batch", "5 h 10 m", "18 m", "w1", "n1", .3) + metric("Failed runs / week", "7", "0", "w2", "n2", .7) + '</div>')
    # ---- phase 4: review
    t4 = 12
    if anim: css.append(kf_stroke(P + 'tk', t4 + .5))
    review = ('<div style="display:flex;align-items:center;gap:12px;"><svg width="28" height="28" viewBox="0 0 28 28" style="flex:none;"><rect x="1" y="1" width="26" height="26" rx="7" fill="none" stroke="' + k["acc"] + '" stroke-width="1.5"/><path d="M8 14.5 L12.5 19 L20 9.5" fill="none" stroke="' + k["acc"] + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="40" style="stroke-dashoffset:' + ('40' if anim else '0') + ';' + A(P + 'tk') + '"/></svg><div style="font-size:19px;font-weight:600;letter-spacing:-.03em;color:' + k["text"] + ';">Increment 1 &#183; shipped</div></div>'
              '<div style="margin-top:16px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">')
    for j, (a, b) in enumerate([("Shipped", "14 / 14"), ("Slipped", "0"), ("Cost", "on plan")]):
        review += '<div style="border-top:1px solid ' + k["hair"] + ';padding-top:8px;' + item_style(P + 'v' + str(j), t4 + .6 + .25 * j) + '"><div style="' + lab + 'color:' + k["dim"] + ';">' + a + '</div><div style="' + mono + 'font-size:15px;color:' + k["text"] + ';margin-top:4px;">' + b + '</div></div>'
    review += ('</div><div style="margin-top:20px;display:flex;gap:10px;' + item_style(P + 'v3', t4 + 1.5) + '"><div style="background:' + k["acc"] + ';color:' + k["accInk"] + ';' + mono + 'font-size:11px;letter-spacing:.12em;text-transform:uppercase;padding:10px 14px;border-radius:8px;">Continue</div><div style="box-shadow:inset 0 0 0 1px ' + k["border"] + ';color:' + k["text"] + ';' + mono + 'font-size:11px;letter-spacing:.12em;text-transform:uppercase;padding:10px 14px;border-radius:8px;">Hand over</div><div style="align-self:center;margin-left:auto;' + mono + 'font-size:11px;color:' + k["dim"] + ';">Your call, every fortnight.</div></div>')
    layers = [brief, scope, people, measured, review]
    body = '<div style="position:relative;height:196px;">'
    for i, L in enumerate(layers):
        body += '<div style="' + layer_style(i) + '">' + L + '</div>'
    body += '</div>'
    facts = [("First engineer in", "10 working days"), ("Overlap with GMT", "4 h, daily"), ("Notice", "30 days, either side"), ("Delivered from", "Lahore &#183; GMT+5"), ("Minimum term", "3 months rolling"), ("Day rate from", "[YOUR RATE]")]
    body += '<div style="margin-top:auto;border-top:1px solid ' + k["hair"] + ';padding-top:12px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px 14px;">' + ''.join('<div><div style="' + lab + 'color:' + k["dim"] + ';white-space:nowrap;">' + a + '</div><div style="' + mono + 'font-size:12px;color:' + k["text"] + ';margin-top:3px;white-space:nowrap;">' + b + '</div></div>' for a, b in facts) + '</div>'
    if anim:
        css.append('@media (prefers-reduced-motion:reduce){.' + P + ' *{animation:none!important}.' + P + ' [data-l]{opacity:0!important}.' + P + ' [data-l="2"]{opacity:1!important}}')
    html = ('<style>' + ''.join(css) + '</style><div class="' + P + '" style="box-sizing:border-box;width:' + str(w) + 'px;height:' + str(h) + 'px;border:1px solid ' + k["border"] + ';background:' + k["bg"] + ';border-radius:14px;padding:22px 24px 24px;display:flex;flex-direction:column;overflow:hidden;position:relative;">' + head + rail + body + '</div>')
    # tag layers for reduced-motion rule
    for i in range(5):
        html = html.replace('<div style="' + layer_style(i) + '">', '<div data-l="' + str(i) + '" style="' + layer_style(i) + '">', 1)
    return html

if __name__ == "__main__":
    import sys
    open(sys.argv[1], 'w').write('<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"><style>body{margin:0;background:#0E1116;padding:40px;font-family:"Space Grotesk",sans-serif}</style></head><body>' + panel(True, "anim") + '</body></html>')
    print("written")
