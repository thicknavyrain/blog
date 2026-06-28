import numpy as np
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
import math

def taylor_cos(x, max_degree):
    """Calculates the Taylor polynomial of cos(x) up to max_degree."""
    result = np.zeros_like(x)
    for n in range((max_degree // 2) + 1):
        term = ((-1)**n * x**(2*n)) / math.factorial(2*n)
        result += term
    return result

def plot_with_blur(ax, x, y, color, base_lw, base_alpha, zorder):
    """Crisp engraved line with one faint bloom layer (letterpress, not neon)."""
    ax.plot(x, y, color=color, alpha=base_alpha, linewidth=base_lw, zorder=zorder,
            solid_capstyle='round')
    ax.plot(x, y, color=color, alpha=base_alpha * 0.18, linewidth=base_lw + 2.0, zorder=zorder,
            solid_capstyle='round')

def ink_ramp(mode):
    """Monochrome purple ink ramp for the Taylor approximations."""
    if mode == "dark":
        stops = ["#5a3a6b", "#8e69a0", "#c2a0d6", "#e6d2f2"]
        main = "#caa3e2"
        base_alpha = 0.62
    else:
        stops = ["#c9b6d3", "#9a76a8", "#6c3f74", "#4a2545"]
        main = "#4a2545"
        base_alpha = 0.5
    cmap = mcolors.LinearSegmentedColormap.from_list(f"ink_{mode}", stops)
    return cmap, main, base_alpha

def generate_banner(mode="dark"):
    """Generates the production SVG, a transparent PNG, and a paper preview PNG."""
    # SAME sampling, SAME Taylor orders, SAME view box as the original.
    x = np.linspace(-15, 15, 2000)
    degrees = np.arange(2, 36, 2)

    fig, ax = plt.subplots(figsize=(16, 4))

    cmap, main_curve_color, base_alpha = ink_ramp(mode)
    color_range = np.linspace(0.0, 1.0, len(degrees))
    colors = cmap(color_range)

    poly_linewidth = 1.1   # was 2.6 — thin engraved line
    main_linewidth = 2.6   # was 8.5 — fine ink, not a slab

    # 1. Taylor expansions (same curves as before, new ink)
    for i, degree in enumerate(degrees):
        y_approx = taylor_cos(x, degree)
        plot_with_blur(ax, x, y_approx, colors[i], poly_linewidth, base_alpha, zorder=1)

    # 2. Main cosine curve
    plot_with_blur(ax, x, np.cos(x), main_curve_color, main_linewidth, 0.95, zorder=2)

    # 3. Same axes / padding / limits as the original
    ax.axis('off')
    ax.set_ylim(-4.5, 4.5)
    ax.set_xlim(-13, 13)

    # --- Production SVG (transparent: the header CSS supplies the paper) ---
    svg_filename = f'taylor_cosine_banner_{mode}.svg'
    plt.savefig(svg_filename, format='svg', bbox_inches='tight', pad_inches=0,
                transparent=True, edgecolor='none')
    print(f"Saved production SVG: {svg_filename}")

    # --- Transparent PNG (handy for previews / raster fallbacks) ---
    png_filename = f'taylor_cosine_banner_{mode}.png'
    plt.savefig(png_filename, format='png', bbox_inches='tight', pad_inches=0,
                transparent=True, dpi=150, edgecolor='none')
    print(f"Saved transparent PNG: {png_filename}")

    # --- Paper preview PNG: curves on the actual paper colour, no wash ---
    paper = '#14111a' if mode == 'dark' else '#f5f0e6'
    fig.patch.set_facecolor(paper)
    ax.set_facecolor(paper)
    preview_filename = f'taylor_cosine_preview_{mode}.png'
    plt.savefig(preview_filename, format='png', bbox_inches='tight', pad_inches=0.05,
                facecolor=fig.get_facecolor(), transparent=False, edgecolor='none', dpi=150)
    print(f"Saved paper preview PNG: {preview_filename}\n")

    plt.close(fig)

generate_banner("dark")
generate_banner("light")
