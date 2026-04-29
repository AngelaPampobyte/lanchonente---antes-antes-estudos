
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import matplotlib.patheffects as pe

fig, ax = plt.subplots(1, 1, figsize=(20, 14))
ax.set_xlim(0, 20)
ax.set_ylim(0, 14)
ax.axis('off')
ax.set_facecolor('white')
fig.patch.set_facecolor('white')

def draw_entity(ax, x, y, w, h, name, pk_fields, fields):
    # Header
    header = FancyBboxPatch((x, y + h - 0.7), w, 0.7,
                             boxstyle="square,pad=0", 
                             facecolor='#1a4f8a', edgecolor='#0d2b4e', linewidth=1.5)
    ax.add_patch(header)
    ax.text(x + w/2, y + h - 0.35, name, ha='center', va='center',
            fontsize=11, fontweight='bold', color='white', fontfamily='monospace')
    
    # PK section
    pk_h = len(pk_fields) * 0.45
    pk_box = FancyBboxPatch((x, y + h - 0.7 - pk_h), w, pk_h,
                             boxstyle="square,pad=0",
                             facecolor='#e8f0fb', edgecolor='#0d2b4e', linewidth=1.5)
    ax.add_patch(pk_box)
    for i, field in enumerate(pk_fields):
        fy = y + h - 0.7 - (i+0.5)*0.45
        ax.text(x + 0.15, fy, '🔑 ' + field, ha='left', va='center',
                fontsize=8.5, color='#1a4f8a', fontfamily='monospace', fontstyle='italic')

    # Fields section
    fields_h = len(fields) * 0.42
    fields_box = FancyBboxPatch((x, y + h - 0.7 - pk_h - fields_h), w, fields_h,
                                 boxstyle="square,pad=0",
                                 facecolor='#ffffff', edgecolor='#0d2b4e', linewidth=1.5)
    ax.add_patch(fields_box)
    for i, field in enumerate(fields):
        fy = y + h - 0.7 - pk_h - (i+0.5)*0.42
        color = '#c0392b' if 'FK' in field else '#2c3e50'
        ax.text(x + 0.15, fy, field, ha='left', va='center',
                fontsize=8, color=color, fontfamily='monospace')

def draw_rel(ax, x1, y1, x2, y2, label, card1='1', card2='N'):
    ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle='->', color='#2c3e50', lw=1.5))
    mx, my = (x1+x2)/2, (y1+y2)/2
    ax.text(mx, my + 0.18, label, ha='center', va='bottom',
            fontsize=8, color='#555', style='italic',
            bbox=dict(boxstyle='round,pad=0.15', facecolor='#fffde7', edgecolor='#ccc', alpha=0.9))
    ax.text(x1 + (x2-x1)*0.12, y1 + (y2-y1)*0.12 + 0.12, card1,
            ha='center', va='center', fontsize=9, fontweight='bold', color='#1a4f8a')
    ax.text(x2 - (x2-x1)*0.12, y2 - (y2-y1)*0.12 + 0.12, card2,
            ha='center', va='center', fontsize=9, fontweight='bold', color='#1a4f8a')

# ── PRODUTOS ──
draw_entity(ax, 0.3, 7.5, 4.2, 5.2, 'PRODUTOS',
    ['id_prod  INT  PK'],
    ['categoria_prod  VARCHAR(50)  NN',
     'nome_prod  VARCHAR(100)  NN',
     'descricao_prod  VARCHAR(255)',
     'preco_prod  DECIMAL(8,2)  NN',
     'estoque_prod  INT  NN  DEF 0',
     'disponivel  BOOLEAN  NN  DEF TRUE',
     'criado_em  TIMESTAMP'])

# ── PEDIDOS ──
draw_entity(ax, 7.8, 7.5, 4.5, 4.5, 'PEDIDOS',
    ['id_pedido  INT  PK'],
    ['total_pedido  DECIMAL(8,2)  NN',
     'status  VARCHAR(20)  DEF confirmado',
     'id_cliente_pd  INT  FK  NULL',
     'criado_em  TIMESTAMP'])

# ── CLIENTES_FIADO ──
draw_entity(ax, 15.3, 7.5, 4.4, 4.5, 'CLIENTE_PAGAR_DEPOIS',
    ['id_clientepd  INT  PK'],
    ['nome  VARCHAR(100)  NN',
     'whatsapp  VARCHAR(20)  NN  UNIQUE',
     'ativo  BOOLEAN  DEF TRUE',
     'criado_em  TIMESTAMP'])

# ── ITENS_PEDIDO ──
draw_entity(ax, 4.0, 1.0, 5.0, 4.5, 'ITENS_PEDIDO',
    ['id_item  INT  PK'],
    ['id_pedido  INT  FK  NN',
     'id_produto  INT  FK  NN',
     'quantidade  INT  NN',
     'preco_unit  DECIMAL(8,2)  NN'])

# ── DIVIDAS ──
draw_entity(ax, 10.5, 1.0, 5.0, 5.0, 'DIVIDAS',
    ['id_divida  INT  PK'],
    ['id_cliente  INT  FK  NN',
     'id_pedido  INT  FK  NN',
     'valor  DECIMAL(8,2)  NN',
     'pago  BOOLEAN  DEF FALSE',
     'pago_em  TIMESTAMP  NULL',
     'criado_em  TIMESTAMP'])

# ── RELACIONAMENTOS ──
# produtos → itens_pedido
draw_rel(ax, 2.5, 7.5, 5.5, 5.5, 'contém', '1', 'N')
# pedidos → itens_pedido
draw_rel(ax, 8.5, 7.5, 7.5, 5.5, 'possui', '1', 'N')
# cliente_pagar_depois → pedidos
draw_rel(ax, 15.5, 9.0, 12.3, 9.0, 'realiza', '0..1', 'N')
# cliente_pagar_depois → dividas
draw_rel(ax, 16.5, 7.5, 14.0, 5.5, 'deve', '1', 'N')
# pedidos → dividas
draw_rel(ax, 10.5, 8.0, 13.0, 5.5, 'gera', '0..1', 'N')

# Título
ax.text(10, 13.6, 'MER — Sistema Lanchonete', ha='center', va='center',
        fontsize=16, fontweight='bold', color='#1a4f8a')
ax.text(10, 13.2, 'Modelo Entidade-Relacionamento (Padrão UML)', ha='center', va='center',
        fontsize=10, color='#555')

# Legenda
legend_items = [
    mpatches.Patch(facecolor='#e8f0fb', edgecolor='#1a4f8a', label='PK — Chave Primária'),
    mpatches.Patch(facecolor='#ffffff', edgecolor='#1a4f8a', label='FK — Chave Estrangeira (vermelho)'),
    mpatches.Patch(facecolor='#fffde7', edgecolor='#ccc', label='NN — Not Null  |  DEF — Default'),
]
ax.legend(handles=legend_items, loc='lower left', fontsize=8.5,
          framealpha=0.95, edgecolor='#ccc', fancybox=True)

plt.tight_layout(pad=0.5)
plt.savefig('/mnt/user-data/outputs/MER_lanchonete.png', dpi=180, bbox_inches='tight',
            facecolor='white', edgecolor='none')
plt.close()
print("MER gerado!")



