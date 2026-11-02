"use client";

import { useState, useCallback } from "react";

/* ─── Paleta AFM ──────────────────────────────────────────── */
const C = {
  navy:  "#253142",
  ouro:  "#b89b5e",
  ouro2: "#ac8540",
  nude:  "#a5948a",
  creme: "#f6f1ec",
  off:   "#1d1d1b",
};

/* ─── Abas ────────────────────────────────────────────────── */
const TABS = [
  { id: "marca",        label: "01 · Sobre a Marca" },
  { id: "produto",      label: "02 · Produto" },
  { id: "publico",      label: "03 · Público" },
  { id: "digital",      label: "04 · Presença Digital" },
  { id: "concorrencia", label: "05 · Concorrência" },
  { id: "objetivos",    label: "06 · Objetivos" },
  { id: "estetica",     label: "07 · Tom e Estética" },
  { id: "experiencia",  label: "08 · Experiência" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const SUBTITLES: Record<TabId, string> = {
  marca:        "De onde vem a marca — a história que vai guiar todo o conteúdo",
  produto:      "O que você vende, como é feito e o que o torna especial",
  publico:      "Quem compra de você — a pessoa real por trás de cada venda",
  digital:      "O que já existe no digital antes de começarmos",
  concorrencia: "Quem você observa, o que admira e onde está sua diferença",
  objetivos:    "Para onde você quer ir — metas, sonhos e o que é sucesso para você",
  estetica:     "Como a marca fala, parece e se comporta no digital",
  experiencia:  "O que já foi tentado e o que você espera dessa parceria",
};

const FIELDS_BY_TAB: Record<TabId, string[]> = {
  marca:        ["nomeMarca","nomeResponsavel","origemNome","comoNasceu","historiaPessoal","marcoImportante","marcaComoPersonagem","valorCentral"],
  produto:      ["produtosPrincipais","carroChefe","dificuldadeVender","ticketMedio","processoCriacao","diferencialProduto","materiais","lancamentos"],
  publico:      ["quemECliente","faixaEtaria","ondeMora","poderAquisitivo","comoDescobre","motivacaoCompra","oQueElogia","oQueReclama","personaIdeal","quemNaoE"],
  digital:      ["redesAtuais","instagramArroba","seguidoresIg","engajamento","quemGerencia","frequenciaAtual","melhorConteudo","piorConteudo","jaFezAds","orcamentoAds","materialVisual"],
  concorrencia: ["concorrentes","admiraNeles","naoQuerParecer","referenciasFora","lacunaMercado","posicionamento","diferencialVsConcorrentes"],
  objetivos:    ["objetivoPrincipal","outrosObjetivos","metaSeguidores","metaVendas","prazo","sazonalidades","sonho1Ano","maiorMedo","sucessoParaVoce"],
  estetica:     ["tresPalavras","tomVoz","escalaFormal","escalaVisual","coresAma","coresOdeia","perfisRef","naoQuerNoConteudo","palavrasPode","palavrasNunca"],
  experiencia:  ["jaTrabalhou","oQueFuncionou","oQueFrustrou","expectativa","feedbacks","disponibilidade","prazoAprovacao"],
};

type FormData = Record<string, string | number | undefined>;

/* ─── Estilos base ────────────────────────────────────────── */
const inp: React.CSSProperties = {
  width: "100%", border: "1.5px solid rgba(37,49,66,0.13)",
  borderRadius: 7, padding: "10px 14px", fontSize: 13.5,
  background: "#FEFDFB", color: C.off, outline: "none", fontFamily: "inherit",
  boxSizing: "border-box",
};
const ta: React.CSSProperties = { ...inp, resize: "vertical", lineHeight: 1.6 };

/* ─── Componentes base ────────────────────────────────────── */
function Lbl({ t }: { t: string }) {
  return <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "1.8px", fontWeight: 600, color: C.nude, marginBottom: 5 }}>{t}</p>;
}
function Hint({ t }: { t: string }) {
  return <p style={{ fontSize: 11.5, color: "#B8AFA7", fontStyle: "italic", marginBottom: 5, marginTop: -3 }}>{t}</p>;
}
function F({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <div style={{ display: "flex", flexDirection: "column" }}><Lbl t={label} />{hint && <Hint t={hint} />}{children}</div>;
}
function G2({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 250px), 1fr))", gap: 16 }}>{children}</div>;
}
function G3({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 180px), 1fr))", gap: 16 }}>{children}</div>;
}
function In({ name, ph, data, set }: { name: string; ph: string; data: FormData; set(k: string, v: string): void }) {
  return <input style={inp} placeholder={ph} value={(data[name] as string) ?? ""} onChange={e => set(name, e.target.value)} />;
}
function Ta({ name, ph, data, set, rows = 3 }: { name: string; ph: string; data: FormData; set(k: string, v: string): void; rows?: number }) {
  return <textarea style={{ ...ta, minHeight: rows * 28 + 20 }} placeholder={ph} value={(data[name] as string) ?? ""} onChange={e => set(name, e.target.value)} />;
}
function Sel({ name, opts, data, set }: { name: string; opts: string[]; data: FormData; set(k: string, v: string): void }) {
  return (
    <select style={inp} value={(data[name] as string) ?? ""} onChange={e => set(name, e.target.value)}>
      <option value="">Selecione...</option>
      {opts.map(o => <option key={o}>{o}</option>)}
    </select>
  );
}
function Checks({ name, opts, data, set }: { name: string; opts: string[]; data: FormData; set(k: string, v: string): void }) {
  const cur = ((data[name] as string) ?? "").split(",").filter(Boolean);
  const toggle = (v: string) =>
    set(name, cur.includes(v) ? cur.filter(x => x !== v).join(",") : [...cur, v].join(","));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 140px), 1fr))", gap: 8 }}>
      {opts.map(o => {
        const on = cur.includes(o);
        return (
          <label key={o} onClick={() => toggle(o)} style={{
            display: "flex", alignItems: "center", gap: 9,
            background: on ? "rgba(184,155,94,0.05)" : "white",
            border: `1.5px solid ${on ? C.ouro : "rgba(37,49,66,0.12)"}`,
            borderRadius: 7, padding: "9px 12px", cursor: "pointer",
            fontSize: 12.5, userSelect: "none",
          }}>
            <span style={{
              width: 13, height: 13, borderRadius: 3, flexShrink: 0, position: "relative",
              border: on ? "none" : "1.5px solid rgba(37,49,66,0.2)",
              background: on ? C.navy : "transparent",
            }}>
              {on && <span style={{ position: "absolute", top: 1, left: 3, width: 4, height: 7, border: `1.5px solid ${C.ouro}`, borderTop: "none", borderLeft: "none", transform: "rotate(45deg)" }} />}
            </span>
            {o}
          </label>
        );
      })}
    </div>
  );
}
function Esc({ name, l1, l2, data, set }: { name: string; l1: string; l2: string; data: FormData; set(k: string, v: number): void }) {
  const v = (data[name] as number) ?? 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <span style={{ fontSize: 12, fontWeight: 500, color: C.off, flex: "1 1 120px" }}>{l1}</span>
      <div style={{ display: "flex", gap: 6 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} type="button" onClick={() => set(name, n)} style={{
            width: 28, height: 28, borderRadius: "50%",
            border: `1.5px solid ${v >= n ? C.navy : "rgba(37,49,66,0.15)"}`,
            background: v >= n ? C.navy : "white",
            color: v >= n ? C.ouro : "#C8BEAF",
            fontSize: 10.5, fontWeight: 600, cursor: "pointer",
          }}>{n}</button>
        ))}
      </div>
      <span style={{ fontSize: 12, fontWeight: 500, textAlign: "right", flex: "1 1 120px", color: C.off }}>{l2}</span>
    </div>
  );
}

/* ─── Abas de conteúdo ────────────────────────────────────── */
function TabMarca({ data, set }: { data: FormData; set(k: string, v: string): void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <G2>
        <F label="Nome da marca / loja"><In name="nomeMarca" ph="Como a sua marca se chama?" data={data} set={set} /></F>
        <F label="Nome do responsável"><In name="nomeResponsavel" ph="Quem está por trás de tudo" data={data} set={set} /></F>
      </G2>
      <F label="De onde vem o nome da marca?" hint="Tem algum significado especial, história ou origem?">
        <Ta name="origemNome" ph="Conte a história por trás do nome..." data={data} set={set} />
      </F>
      <F label="Como a marca nasceu?" hint="O que motivou a criação, qual foi o ponto de virada?">
        <Ta name="comoNasceu" ph="O início da sua história com a marca..." data={data} set={set} rows={4} />
      </F>
      <F label="Tem uma história pessoal que conecta você à marca?" hint="Algo que viveu e que deu origem a esse negócio">
        <Ta name="historiaPessoal" ph="A história que faz parte da alma do que você vende..." data={data} set={set} rows={4} />
      </F>
      <F label="Qual foi o maior marco ou conquista da marca até hoje?">
        <Ta name="marcoImportante" ph="Uma venda especial, um reconhecimento, um momento que você nunca esquece..." data={data} set={set} />
      </F>
      <F label="Se a marca fosse uma pessoa, como ela seria?">
        <Ta name="marcaComoPersonagem" ph="Personalidade, jeito de ser, valores que ela teria..." data={data} set={set} />
      </F>
      <F label="Qual é o valor central que move a marca?" hint="Autenticidade, qualidade, propósito, pertencimento, sustentabilidade...">
        <Ta name="valorCentral" ph="O que a marca defende além de vender..." data={data} set={set} />
      </F>
    </div>
  );
}

function TabProduto({ data, set }: { data: FormData; set(k: string, v: string): void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <F label="O que você vende? Descreva todos os seus produtos" hint="Seja detalhada — tipos, categorias, variações">
        <Ta name="produtosPrincipais" ph="Liste seus produtos e descreva cada um brevemente..." data={data} set={set} rows={4} />
      </F>
      <G2>
        <F label="Qual é o produto carro-chefe?" hint="O que mais vende ou mais te representa">
          <Ta name="carroChefe" ph="O produto que as pessoas mais pedem..." data={data} set={set} rows={2} />
        </F>
        <F label="Qual produto tem dificuldade de vender?">
          <Ta name="dificuldadeVender" ph="O que encalha ou precisa de mais divulgação..." data={data} set={set} rows={2} />
        </F>
      </G2>
      <F label="Qual é o ticket médio?" hint="Preço mais barato, mais caro e o mais comum">
        <In name="ticketMedio" ph="Ex: de R$50 a R$300, a maioria sai por volta de R$120" data={data} set={set} />
      </F>
      <F label="Como o seu produto é feito ou de onde vem?" hint="Produção própria, fornecedores, artesanal, importado?">
        <Ta name="processoCriacao" ph="Descreva o processo do início ao fim..." data={data} set={set} rows={4} />
      </F>
      <F label="O que torna o seu produto diferente de tudo que existe?" hint="Exclusividade, qualidade, história, propósito, personalização...">
        <Ta name="diferencialProduto" ph="O que ninguém mais tem..." data={data} set={set} />
      </F>
      <G2>
        <F label="Quais materiais ou componentes você usa?">
          <Ta name="materiais" ph="Matéria-prima, origem, o que destaca..." data={data} set={set} rows={2} />
        </F>
        <F label="Você trabalha com lançamentos ou coleções?">
          <Ta name="lancamentos" ph="Como você organiza novidades ao longo do ano..." data={data} set={set} rows={2} />
        </F>
      </G2>
    </div>
  );
}

function TabPublico({ data, set }: { data: FormData; set(k: string, v: string): void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <F label="Quem é a sua cliente hoje?" hint="Descreva essa pessoa com o máximo de detalhes">
        <Ta name="quemECliente" ph="Profissão, rotina, o que ela valoriza, como ela vive..." data={data} set={set} rows={4} />
      </F>
      <G3>
        <F label="Faixa etária principal">
          <Sel name="faixaEtaria" opts={["18–24 anos","25–34 anos","35–44 anos","45–55 anos","55+ anos","Variado"]} data={data} set={set} />
        </F>
        <F label="Onde mora a maioria?">
          <In name="ondeMora" ph="Cidade, estado, região, país..." data={data} set={set} />
        </F>
        <F label="Poder aquisitivo médio">
          <Sel name="poderAquisitivo" opts={["Classe C — acessível","Classe B — médio","Classe A/B — premium","Variado"]} data={data} set={set} />
        </F>
      </G3>
      <F label="Como a sua cliente descobre a sua marca?">
        <Ta name="comoDescobre" ph="Boca a boca, Instagram, busca no Google, feiras, indicação..." data={data} set={set} rows={3} />
      </F>
      <F label="O que faz ela decidir comprar?">
        <Ta name="motivacaoCompra" ph="Desejo, necessidade, identificação, presente, ocasião especial..." data={data} set={set} rows={3} />
      </F>
      <G2>
        <F label="O que ela mais elogia?">
          <Ta name="oQueElogia" ph="Qualidade, atendimento, embalagem, identidade, exclusividade..." data={data} set={set} rows={3} />
        </F>
        <F label="O que ela já reclamou ou pediu que fosse diferente?">
          <Ta name="oQueReclama" ph="Prazo, preço, tamanho, variedade, comunicação..." data={data} set={set} rows={3} />
        </F>
      </G2>
      <F label="Descreva a sua cliente ideal como se fosse uma pessoa real" hint="Dê um nome, uma cidade, uma rotina — faça ela ganhar vida">
        <Ta name="personaIdeal" ph="Ex: Camila, 31 anos, empreendedora em BH. Valoriza marcas com propósito..." data={data} set={set} rows={5} />
      </F>
      <F label="Quem NÃO é a sua cliente?">
        <Ta name="quemNaoE" ph="Quem você não quer atrair ou que não se identifica com o que você faz..." data={data} set={set} rows={2} />
      </F>
    </div>
  );
}

function TabDigital({ data, set }: { data: FormData; set(k: string, v: string): void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <F label="Quais redes você já tem?" hint="Selecione todas, mesmo as abandonadas">
        <Checks name="redesAtuais" opts={["Instagram","Facebook","TikTok","YouTube","WhatsApp Business","Pinterest","Marketplace (Shopee/ML)","Site próprio","LinkedIn"]} data={data} set={set} />
      </F>
      <G2>
        <F label="@ do Instagram (se tiver)"><In name="instagramArroba" ph="@nomedamarca" data={data} set={set} /></F>
        <F label="Quantos seguidores tem hoje?"><In name="seguidoresIg" ph="Ex: 2.400 seguidores" data={data} set={set} /></F>
      </G2>
      <F label="Você sabe qual é a sua taxa de engajamento?" hint="Se não sabe, tudo bem — só diga que não sabe">
        <In name="engajamento" ph="Ex: em torno de 3–5%, ou 'não sei ainda'" data={data} set={set} />
      </F>
      <F label="Quem gerencia as redes hoje?">
        <Ta name="quemGerencia" ph="Você mesma, um funcionário, ninguém, uma agência?" data={data} set={set} rows={2} />
      </F>
      <F label="Com que frequência você posta atualmente?">
        <Sel name="frequenciaAtual" opts={["Todo dia","3–5x por semana","1–2x por semana","Raramente","Não posto com regularidade"]} data={data} set={set} />
      </F>
      <G2>
        <F label="Qual conteúdo já performou bem?" hint="Tipo, formato ou tema que gerou reação">
          <Ta name="melhorConteudo" ph="Foto de produto, bastidor, depoimento, tutorial..." data={data} set={set} rows={3} />
        </F>
        <F label="Qual conteúdo não engajou nada?">
          <Ta name="piorConteudo" ph="O que você postou que caiu no silêncio..." data={data} set={set} rows={3} />
        </F>
      </G2>
      <F label="Você já fez anúncios pagos (tráfego pago)?">
        <Sel name="jaFezAds" opts={["Nunca fiz","Tentei por conta própria","Fiz com outra agência","Faço atualmente"]} data={data} set={set} />
      </F>
      <F label="Tem orçamento disponível para anúncios?">
        <In name="orcamentoAds" ph="Ex: R$300/mês, ainda não sei, não por agora..." data={data} set={set} />
      </F>
      <F label="Você tem material visual disponível?">
        <Sel name="materialVisual" opts={["Tenho bastante material bom","Tenho pouco material","Só fotos amadoras do celular","Não tenho nada ainda"]} data={data} set={set} />
      </F>
    </div>
  );
}

function TabConcorrencia({ data, set }: { data: FormData; set(k: string, v: string): void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <F label="Quem você considera seus concorrentes diretos?" hint="Nome da marca ou @perfil — cite quantos quiser">
        <Ta name="concorrentes" ph="Marcas ou lojas similares que você acompanha..." data={data} set={set} rows={3} />
      </F>
      <F label="O que você admira nessas marcas?" hint="Conteúdo, visual, posicionamento, comunidade, atendimento...">
        <Ta name="admiraNeles" ph="Seja honesta — o que funciona bem nelas..." data={data} set={set} rows={3} />
      </F>
      <F label="O que você não quer parecer?" hint="O que vê em outras marcas e pensa 'não quero ser assim'">
        <Ta name="naoQuerParecer" ph="Genérico, sem profundidade, muito corporativo..." data={data} set={set} rows={3} />
      </F>
      <F label="Quais marcas você admira fora do seu nicho?">
        <Ta name="referenciasFora" ph="Marcas de outros segmentos que admira..." data={data} set={set} rows={3} />
      </F>
      <F label="Na sua opinião, o que falta no seu mercado hoje?">
        <Ta name="lacunaMercado" ph="O que nenhum concorrente faz direito que você poderia fazer..." data={data} set={set} rows={3} />
      </F>
      <F label="Como você quer ser percebida no mercado?">
        <Ta name="posicionamento" ph="A mais qualificada, a mais acessível, a mais autêntica..." data={data} set={set} rows={3} />
      </F>
      <F label="O que você tem que nenhum concorrente tem?">
        <Ta name="diferencialVsConcorrentes" ph="Sua história, seu processo, sua visão, sua comunidade..." data={data} set={set} rows={3} />
      </F>
    </div>
  );
}

function TabObjetivos({ data, set }: { data: FormData; set(k: string, v: string): void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <F label="Qual é o seu objetivo principal com as redes agora?">
        <Ta name="objetivoPrincipal" ph="Vender mais, crescer o perfil, construir autoridade, lançar um produto..." data={data} set={set} rows={3} />
      </F>
      <F label="E quais outros objetivos fazem parte do plano?">
        <Checks name="outrosObjetivos" opts={["Aumentar seguidores","Vender mais","Aumentar engajamento","Lançar produtos novos","Construir identidade visual","Aparecer na mídia","Vender no atacado","Expandir para novas regiões","Criar comunidade","Atrair parceiros","Ganhar autoridade no nicho"]} data={data} set={set} />
      </F>
      <G2>
        <F label="Meta de seguidores em 3 meses"><In name="metaSeguidores" ph="Ex: chegar a 5.000 no Instagram" data={data} set={set} /></F>
        <F label="Meta de faturamento ou vendas"><In name="metaVendas" ph="Ex: aumentar 30% as vendas mensais" data={data} set={set} /></F>
      </G2>
      <F label="Em quanto tempo você espera ver resultado?">
        <Sel name="prazo" opts={["1 mês","3 meses","6 meses","1 ano","Sem pressa — quero construir com base sólida"]} data={data} set={set} />
      </F>
      <F label="Quais são as datas mais importantes para o seu negócio?">
        <Ta name="sazonalidades" ph="Natal, Dia das Mães, Black Friday, Dia dos Namorados, lançamentos sazonais..." data={data} set={set} rows={3} />
      </F>
      <F label="Onde você quer estar daqui a 1 ano?">
        <Ta name="sonho1Ano" ph="Seguidores, faturamento, loja física, atacado, exportar, equipe..." data={data} set={set} rows={3} />
      </F>
      <F label="O que te preocupa ou te dá medo nesse processo?">
        <Ta name="maiorMedo" ph="Não crescer, investir e não ver retorno, não saber o que postar..." data={data} set={set} rows={3} />
      </F>
      <F label="O que seria sucesso para você nessa parceria?">
        <Ta name="sucessoParaVoce" ph="Quando eu souber que funcionou é quando..." data={data} set={set} rows={3} />
      </F>
    </div>
  );
}

function TabEstetica({ data, set }: { data: FormData; set(k: string, v: string | number): void }) {
  const setStr = set as (k: string, v: string) => void;
  const setNum = set as (k: string, v: number) => void;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <F label="Descreva a sua marca em 3 palavras">
        <In name="tresPalavras" ph="Ex: acolhedora, ousada, artesanal" data={data} set={setStr} />
      </F>
      <F label="Como a sua marca fala?" hint="Tom de voz — formal, descontraído, inspirador, direto, poético?">
        <Ta name="tomVoz" ph="Fala como uma amiga? Com autoridade? Com leveza?" data={data} set={setStr} rows={3} />
      </F>
      <F label="Ajuste a escala de personalidade da marca">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Esc name="escalaFormal" l1="Descontraído / Informal" l2="Sério / Profissional" data={data} set={setNum} />
          <Esc name="escalaVisual" l1="Colorido / Vibrante"     l2="Clean / Minimalista"  data={data} set={setNum} />
        </div>
      </F>
      <G2>
        <F label="Quais cores representam a marca?">
          <Ta name="coresAma" ph="Cores que você usaria em tudo..." data={data} set={setStr} rows={2} />
        </F>
        <F label="Quais cores você nunca usaria?">
          <Ta name="coresOdeia" ph="As que parecem genéricas ou que não combinam..." data={data} set={setStr} rows={2} />
        </F>
      </G2>
      <F label="Quais perfis ou marcas você admira esteticamente?">
        <Ta name="perfisRef" ph="Liste perfis ou marcas que você ama ver..." data={data} set={setStr} rows={3} />
      </F>
      <F label="O que você absolutamente NÃO quer ver no conteúdo da marca?">
        <Ta name="naoQuerNoConteudo" ph="Fotos muito editadas, texto genérico, tom corporativo..." data={data} set={setStr} rows={3} />
      </F>
      <G2>
        <F label="Palavras e frases que a marca pode usar">
          <Ta name="palavrasPode" ph="Expressões, gírias, termos que combinam com a sua marca..." data={data} set={setStr} rows={2} />
        </F>
        <F label="Palavras que a marca NUNCA deve usar">
          <Ta name="palavrasNunca" ph="O que soa errado ou forçado para a sua marca..." data={data} set={setStr} rows={2} />
        </F>
      </G2>
    </div>
  );
}

function TabExperiencia({ data, set }: { data: FormData; set(k: string, v: string): void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <F label="Você já trabalhou com social media ou agência antes?">
        <Sel name="jaTrabalhou" opts={["Nunca trabalhei com ninguém","Já tentei gerenciar sozinha","Trabalhei com freelancer","Trabalhei com agência","Estou trabalhando com outra pessoa atualmente"]} data={data} set={set} />
      </F>
      <F label="O que funcionou nessa experiência anterior?">
        <Ta name="oQueFuncionou" ph="Mesmo que tenha sido pouco — o que deu certo?" data={data} set={set} rows={3} />
      </F>
      <F label="O que te frustrou ou não funcionou?">
        <Ta name="oQueFrustrou" ph="Falta de comunicação, conteúdo genérico, sem resultado..." data={data} set={set} rows={3} />
      </F>
      <F label="O que você espera dessa parceria?">
        <Ta name="expectativa" ph="O que você mais precisa que funcione nessa parceria..." data={data} set={set} rows={4} />
      </F>
      <F label="Como você prefere dar feedbacks no conteúdo?">
        <Ta name="feedbacks" ph="Áudio no WhatsApp, comentário escrito, reunião ao vivo..." data={data} set={set} rows={2} />
      </F>
      <F label="Com que frequência você consegue enviar fotos e vídeos novos?">
        <Sel name="disponibilidade" opts={["Toda semana","A cada 15 dias","Uma vez por mês","Quando der — sem rotina","Prefiro usar o que já existe"]} data={data} set={set} />
      </F>
      <F label="Em quanto tempo você consegue aprovar um conteúdo após receber?">
        <Sel name="prazoAprovacao" opts={["Em poucas horas","Em até 24 horas","Em até 48 horas","Em até 1 semana","Preciso alinhar isso"]} data={data} set={set} />
      </F>
    </div>
  );
}

/* ─── Página principal ────────────────────────────────────── */
export default function BriefingLojaPage() {
  const [tab,    setTab]    = useState(0);
  const [data,   setData]   = useState<FormData>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const set = useCallback((k: string, v: string | number) =>
    setData(p => ({ ...p, [k]: v })), []);

  const totalFields = Object.values(FIELDS_BY_TAB).flat().length;
  const totalFilled = Object.values(FIELDS_BY_TAB).flat()
    .filter(k => !!data[k] && data[k] !== 0).length;

  const tabId     = TABS[tab].id;
  const tabFields = FIELDS_BY_TAB[tabId] ?? [];
  const tabFilled = tabFields.filter(k => !!data[k] && data[k] !== 0).length;

  const isDone = (id: TabId) => {
    const f = FIELDS_BY_TAB[id] ?? [];
    return f.length > 0 && f.filter(k => !!data[k] && data[k] !== 0).length === f.length;
  };

  const handleSubmit = async () => {
    setStatus("sending");
    try {
      const res = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _type: "loja", ...data }),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div style={{ minHeight: "100vh", background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px clamp(12px, 4vw, 32px)" }}>
        <div style={{ textAlign: "center", maxWidth: 440 }}>
          <div style={{ width: 56, height: 56, border: `2px solid ${C.ouro}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: C.ouro, margin: "0 auto 24px" }}>✓</div>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: 32, color: "#f7f8f3", marginBottom: 14 }}>Briefing enviado!</h2>
          <p style={{ fontSize: 14, color: C.nude, lineHeight: 1.8, marginBottom: 20 }}>Recebi todas as suas informações. Em breve entro em contato para darmos início à nossa parceria.</p>
          <p style={{ fontSize: 13, color: C.ouro, fontStyle: "italic" }}>— Ana Fachone</p>
        </div>
      </div>
    );
  }

  const hPad = "clamp(12px, 4vw, 40px)";

  return (
    <div style={{ minHeight: "100vh", background: C.creme, fontFamily: "system-ui,sans-serif" }}>

      {/* HEADER */}
      <header style={{ background: C.navy, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: `16px ${hPad} 0`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, border: `1.5px solid ${C.ouro}`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.ouro }}>AF</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#f7f8f3", letterSpacing: "2.5px" }}>ANA FACHONE</div>
              <div style={{ fontSize: 9, color: C.nude, letterSpacing: "2px", marginTop: 1 }}>MARKETING DIGITAL</div>
            </div>
          </div>
          <div style={{ border: `1px solid rgba(184,155,94,0.35)`, color: C.ouro, padding: "5px 14px", borderRadius: 100, fontSize: 11, fontWeight: 600 }}>
            {totalFilled}/{totalFields} campos
          </div>
        </div>

        {/* Barra de progresso */}
        <div style={{ maxWidth: 1100, margin: "12px auto 0", padding: `0 ${hPad}`, height: 2, background: "rgba(255,255,255,0.08)" }}>
          <div style={{ height: "100%", background: C.ouro, borderRadius: 2, transition: "width 0.4s ease", width: `${totalFields ? (totalFilled / totalFields) * 100 : 0}%` }} />
        </div>

        {/* Abas */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: `0 ${hPad}`, overflowX: "auto", scrollbarWidth: "none" }}>
          <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)", minWidth: "max-content" }}>
            {TABS.map((t, i) => {
              const active   = i === tab;
              const complete = isDone(t.id);
              return (
                <button key={t.id} type="button" onClick={() => setTab(i)} style={{
                  padding: "12px 16px", background: "none", border: "none",
                  borderBottom: `2px solid ${active ? C.ouro : "transparent"}`,
                  marginBottom: -1, fontSize: 10.5, fontWeight: 500,
                  letterSpacing: "0.8px", textTransform: "uppercase",
                  color: active ? C.ouro : C.nude, cursor: "pointer", whiteSpace: "nowrap",
                }}>
                  {t.label}{complete ? " ✓" : ""}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main style={{ maxWidth: 820, margin: "36px auto", padding: `0 ${hPad}` }}>
        <div style={{ background: "white", border: "1px solid rgba(37,49,66,0.1)", borderRadius: 12, overflow: "hidden" }}>

          {/* Card header */}
          <div style={{ padding: `20px clamp(12px, 3vw, 32px) 16px`, borderBottom: "1px solid rgba(37,49,66,0.08)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: 24, fontWeight: 700, color: C.navy }}>
                {TABS[tab].label.split(" · ")[1]}
              </h2>
              <p style={{ fontSize: 12.5, color: C.nude, marginTop: 4 }}>{SUBTITLES[tabId]}</p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16, paddingTop: 4 }}>
              <span style={{ fontFamily: "Georgia,serif", fontSize: 26, fontWeight: 700, color: C.ouro }}>{tabFilled}</span>
              <span style={{ fontSize: 13, color: C.nude }}>/{tabFields.length}</span>
            </div>
          </div>

          {/* Conteúdo da aba */}
          <div style={{ padding: `20px clamp(12px, 3vw, 32px)` }}>
            {tabId === "marca"        && <TabMarca        data={data} set={set as (k: string, v: string) => void} />}
            {tabId === "produto"      && <TabProduto      data={data} set={set as (k: string, v: string) => void} />}
            {tabId === "publico"      && <TabPublico      data={data} set={set as (k: string, v: string) => void} />}
            {tabId === "digital"      && <TabDigital      data={data} set={set as (k: string, v: string) => void} />}
            {tabId === "concorrencia" && <TabConcorrencia data={data} set={set as (k: string, v: string) => void} />}
            {tabId === "objetivos"    && <TabObjetivos    data={data} set={set as (k: string, v: string) => void} />}
            {tabId === "estetica"     && <TabEstetica     data={data} set={set} />}
            {tabId === "experiencia"  && <TabExperiencia  data={data} set={set as (k: string, v: string) => void} />}
          </div>

          {/* Navegação */}
          <div style={{ padding: `14px clamp(12px, 3vw, 32px) 18px`, borderTop: "1px solid rgba(37,49,66,0.07)", display: "flex", justifyContent: "space-between" }}>
            <button type="button" onClick={() => setTab(t => Math.max(0, t - 1))} disabled={tab === 0}
              style={{ padding: "10px 28px", borderRadius: 7, border: "1.5px solid rgba(37,49,66,0.15)", background: "none", color: C.nude, fontSize: 12, fontWeight: 600, letterSpacing: "0.8px", cursor: tab === 0 ? "not-allowed" : "pointer", opacity: tab === 0 ? 0.3 : 1 }}>
              ← Anterior
            </button>
            {tab < TABS.length - 1 ? (
              <button type="button" onClick={() => setTab(t => t + 1)}
                style={{ padding: "10px 28px", borderRadius: 7, border: `1.5px solid ${C.navy}`, background: C.navy, color: C.ouro, fontSize: 12, fontWeight: 600, letterSpacing: "0.8px", cursor: "pointer" }}>
                Próximo →
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={status === "sending"}
                style={{ padding: "10px 28px", borderRadius: 7, border: `1.5px solid ${C.ouro}`, background: C.ouro, color: C.navy, fontSize: 12, fontWeight: 600, letterSpacing: "0.8px", cursor: "pointer", opacity: status === "sending" ? 0.6 : 1 }}>
                {status === "sending" ? "Enviando..." : "Enviar briefing"}
              </button>
            )}
          </div>

          {status === "error" && (
            <p style={{ textAlign: "center", color: "#c0392b", fontSize: 13, paddingBottom: 16 }}>
              Algo deu errado. Tente novamente.
            </p>
          )}
        </div>
      </main>

      <footer style={{ maxWidth: 1100, margin: "0 auto", padding: `20px ${hPad}`, borderTop: "1px solid rgba(37,49,66,0.08)", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "Georgia,serif", fontSize: 15, fontWeight: 700, color: C.navy }}>
          Ana <em style={{ color: C.ouro2 }}>Fachone</em>
        </span>
        <span style={{ fontSize: 11, color: C.nude }}>Marketing Digital · Documento confidencial</span>
      </footer>
    </div>
  );
}
