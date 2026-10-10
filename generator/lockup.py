MONO = "'IBM Plex Mono', monospace"
def mark(size, text, sig):
    return '<span style="font-size: ' + str(size) + 'px; font-weight: 600; letter-spacing: -0.045em; line-height: 1; white-space: nowrap;"><span style="color: ' + text + ';">Hop</span><span style="color: ' + sig + ';">sig</span></span>'
def lockup(size, text, sig, desc=None, ratio=.54, gap=.38, track=.06):
    """Side-by-side lockup: Split wordmark + TECHNOLOGIES in mono caps sitting on the mark's x-height, baseline-aligned, one colour."""
    desc = desc or text
    return ('<span style="display: inline-flex; align-items: baseline; gap: ' + str(round(size * gap, 1)) + 'px; line-height: 1; white-space: nowrap;">' + mark(size, text, sig) +
            '<span style="font-family: ' + MONO + '; font-weight: 500; font-size: ' + str(round(size * ratio, 1)) + 'px; letter-spacing: ' + str(track) + 'em; line-height: 1; text-transform: uppercase; color: ' + desc + ';">Technologies</span></span>')
def lockup_alt(size, text, sig):
    """Alternative: one typeface, Technologies at the same size in 400."""
    return ('<span style="display: inline-flex; align-items: baseline; gap: ' + str(round(size * .22, 1)) + 'px; line-height: 1; white-space: nowrap;">' + mark(size, text, sig) +
            '<span style="font-size: ' + str(size) + 'px; font-weight: 400; letter-spacing: -0.03em; line-height: 1; color: ' + text + ';">Technologies</span></span>')
