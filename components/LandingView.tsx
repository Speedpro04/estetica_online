
import React from 'react';
import './LandingView.css';

interface LandingViewProps {
  onEnterApp: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onEnterApp }) => {
  return (
    <div className="landing-container">
      {/* NAVBAR */}
      <nav>
        <a href="#hero" className="nav-logo">
          <img src="/sol_com_risco_em_baixo-removebg-preview.png" alt="Assistente Solara Logo" style={{ width: '52px', height: '52px' }} />
          <div className="nav-logo-text">
            <span className="assistente">Assistente</span>
            <span className="solara">Solara</span>
            <span className="tagline">IA de Recuperação</span>
          </div>
        </a>
        <ul className="nav-links">
          <li><a href="#problema">O Problema</a></li>
          <li><a href="#solucao">Solução</a></li>
          <li><a href="#como-funciona">Como Funciona</a></li>
          <li><a href="#resultados">Resultados</a></li>
          <li><a href="#precos">Planos</a></li>
          <li>
            <button onClick={onEnterApp} className="btn-nav">
              Acessar o Sistema
            </button>
          </li>
        </ul>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-label fade-up">🤖 Inteligência Artificial para Odontologia</div>
            <h1 className="fade-up delay-1">
              Recupere pacientes que <span>abandonaram tratamentos</span> com inteligência artificial.
            </h1>
            <p className="hero-sub fade-up delay-2">
              O Assistente Solara identifica automaticamente pacientes que não retornaram à clínica e inicia campanhas inteligentes para trazer esses pacientes de volta.
            </p>
            <ul className="hero-benefits fade-up delay-3">
              <li>Identificação automática de pacientes em risco</li>
              <li>Campanhas inteligentes de recuperação</li>
              <li>Convites automáticos via WhatsApp</li>
              <li>Mais pacientes retornando para a clínica</li>
            </ul>
            <div className="hero-btns fade-up delay-4">
              <button onClick={onEnterApp} className="btn-primary">
                🚀 Acessar o Sistema
              </button>
              <a href="#como-funciona" className="btn-white">Ver como funciona →</a>
            </div>
          </div>
          <div className="hero-img fade-up delay-2">
            <img src="/imagens/dent01.png" alt="Clínica Odontológica com Assistente Solara" style={{ height: '480px', objectFit: 'cover', width: '100%' }} loading="lazy" />
            <div className="hero-img-badge">
              <div className="badge-icon">📈</div>
              <div className="badge-text">
                <strong>+28%</strong>
                <span>Taxa de recuperação</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section id="problema">
        <div className="container problema-grid">
          <div className="problema-img">
            <img src="/imagens/02.jpg" alt="Paciente em consulta odontológica" loading="lazy" />
          </div>
          <div>
            <div className="section-label">⚠️ O Problema</div>
            <h2>Clínicas odontológicas perdem pacientes todos os meses.</h2>
            <p style={{ marginTop: '16px', fontSize: '14px', lineHeight: '1.75' }}>
              Muitos pacientes iniciam tratamentos e acabam não retornando para consultas de revisão ou continuidade. Sem acompanhamento adequado, a clínica perde oportunidades importantes de faturamento — sem nem perceber.
            </p>
            <div className="problema-items">
              <div className="problema-item"><span className="pi-icon">❌</span> Pacientes que faltam consultas sem aviso</div>
              <div className="problema-item"><span className="pi-icon">⏳</span> Tratamentos que ficam incompletos ou pausados</div>
              <div className="problema-item"><span className="pi-icon">📅</span> Agenda com horários vazios frequentes</div>
              <div className="problema-item"><span className="pi-icon">👥</span> Equipe sem tempo para acompanhar todos os pacientes</div>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUÇÃO */}
      <section id="solucao">
        <div className="container">
          <div className="solucao-header">
            <div className="section-label">✅ A Solução</div>
            <h2>Uma inteligência artificial trabalhando para sua clínica.</h2>
            <p>O Assistente Solara analisa automaticamente a base de pacientes da clínica, identifica aqueles com maior risco de abandono e cria campanhas inteligentes para trazê-los de volta.</p>
          </div>
          <div className="cards-grid">
            <div className="feat-card">
              <div className="feat-icon">🔍</div>
              <h3>Identificação automática de pacientes inativos</h3>
              <p>A IA analisa toda a base de dados e identifica pacientes em risco de abandono antes que isso aconteça.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">📣</div>
              <h3>Campanhas inteligentes de recuperação</h3>
              <p>Crie e execute campanhas segmentadas automaticamente, com mensagens personalizadas para cada perfil de paciente.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">💬</div>
              <h3>Convites automáticos para retorno</h3>
              <p>O sistema envia convites personalizados via WhatsApp, SMS ou e-mail de forma completamente automática.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">💰</div>
              <h3>Aumento do faturamento da clínica</h3>
              <p>Cada paciente recuperado representa receita real. Acompanhe o faturamento gerado diretamente no painel.</p>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona">
        <div className="container">
          <div className="como-header">
            <div className="section-label teal">⚙️ Como Funciona</div>
            <h2>Como o Assistente Solara recupera pacientes.</h2>
            <p>Processo simples, automático e eficiente — do diagnóstico ao retorno do paciente.</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Análise dos Dados</h3>
              <p>A inteligência artificial analisa automaticamente os dados da clínica e o histórico de todos os pacientes.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Identificação de Risco</h3>
              <p>O sistema identifica e classifica os pacientes com maior risco de abandono de tratamento.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Campanhas Automáticas</h3>
              <p>Campanhas personalizadas são criadas e enviadas automaticamente para convidar os pacientes a retornar.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Pacientes Retornam</h3>
              <p>Os pacientes voltam à clínica, continuam seus tratamentos e a clínica aumenta seu faturamento.</p>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo">
        <div className="container">
          <div className="demo-header">
            <div className="section-label">🖥️ Demonstração</div>
            <h2>Veja o Assistente Solara em ação.</h2>
            <p>Interface limpa e intuitiva com tudo o que sua clínica precisa para recuperar pacientes automaticamente.</p>
          </div>
          <div className="demo-grid">
            <div className="demo-card">
              <img src="/imagens/06.png" alt="Painel de recuperação de pacientes" style={{ objectFit: 'contain', background: '#f0f4f8' }} loading="lazy" />
              <div className="demo-card-body">
                <h3>Painel de Recuperação</h3>
                <p>Visualize todos os pacientes prioritários, score de risco da IA, histórico de contatos e sugestões automáticas.</p>
              </div>
            </div>
            <div className="demo-card">
              <img src="/imagens/01.png" alt="Campanhas inteligentes" style={{ objectFit: 'contain', background: '#f0f4f8' }} loading="lazy" />
              <div className="demo-card-body">
                <h3>Campanhas Inteligentes</h3>
                <p>Execute campanhas sugeridas pela IA em poucos cliques. Acompanhe o progresso e os resultados em tempo real.</p>
              </div>
            </div>
            <div className="demo-card">
              <img src="/imagens/04.png" alt="Acesso ao sistema" style={{ objectFit: 'contain', background: '#f0f4f8' }} loading="lazy" />
              <div className="demo-card-body">
                <h3>Acesso Seguro</h3>
                <p>Login protegido com autenticação de alto nível. Acesse de qualquer dispositivo com segurança total.</p>
              </div>
            </div>
            <div className="demo-card">
              <img src="/imagens/05.jpg" alt="Paciente satisfeita" style={{ objectFit: 'cover', height: '220px' }} loading="lazy" />
              <div className="demo-card-body">
                <h3>Pacientes Mais Satisfeitos</h3>
                <p>Com comunicação proativa e personalizada, os pacientes se sentem valorizados e voltam mais motivados.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTADOS */}
      <section id="resultados">
        <div className="container">
          <div className="resultados-header">
            <div className="section-label">📊 Resultados</div>
            <h2>O impacto do Assistente Solara na clínica.</h2>
          </div>
          <div className="resultados-grid">
            <div className="result-card">
              <span className="result-icon">🔄</span>
              <h3>Mais pacientes retornando</h3>
              <p>Aumento comprovado na taxa de retorno de pacientes que haviam abandonado tratamentos.</p>
            </div>
            <div className="result-card">
              <span className="result-icon">📅</span>
              <h3>Agenda mais preenchida</h3>
              <p>Menos horários vazios e mais consultas realizadas por mês com menos esforço da equipe.</p>
            </div>
            <div className="result-card">
              <span className="result-icon">🦷</span>
              <h3>Mais tratamentos concluídos</h3>
              <p>Pacientes voltam e concluem seus tratamentos, gerando mais valor clínico e financeiro.</p>
            </div>
            <div className="result-card">
              <span className="result-icon">💵</span>
              <h3>Mais faturamento</h3>
              <p>Cada campanha gera faturamento mensurável. Acompanhe em tempo real o retorno sobre o investimento.</p>
            </div>
          </div>
        </div>
      </section>

      {/* INTELIGÊNCIA */}
      <section id="inteligencia">
        <div className="container inteligencia-grid">
          <div>
            <div className="section-label">🧠 Inteligência IA</div>
            <h2>Uma IA especializada em recuperação de pacientes.</h2>
            <p style={{ marginTop: '16px', fontSize: '14px', lineHeight: '1.75' }}>
              O sistema utiliza inteligência artificial para identificar padrões de abandono de tratamento e sugerir ações que aumentam significativamente a chance de retorno dos pacientes. Resultados claros, em tempo real.
            </p>
            <div className="kpi-list">
              <div className="kpi-item"><div className="kpi-dot"></div><span>Taxa de abandono monitorada automaticamente</span></div>
              <div className="kpi-item"><div className="kpi-dot"></div><span>Pacientes em risco identificados por IA</span></div>
              <div className="kpi-item"><div className="kpi-dot"></div><span>Convites enviados e rastreados em tempo real</span></div>
              <div className="kpi-item"><div className="kpi-dot"></div><span>Pacientes recuperados contabilizados</span></div>
              <div className="kpi-item"><div className="kpi-dot"></div><span>Faturamento recuperado calculado automaticamente</span></div>
            </div>
          </div>
          <div className="inteligencia-img">
            <img src="/imagens/dent02.png" alt="Dentista usando sistema de IA" loading="lazy" />
          </div>
        </div>
      </section>

      {/* PREÇOS */}
      <section id="precos">
        <div className="container">
          <div className="precos-header">
            <div className="section-label">💳 Investimento</div>
            <h2>Planos para Clínicas Odontológicas</h2>
            <p>Escolha o plano ideal para o tamanho da sua clínica e comece a recuperar pacientes hoje mesmo.</p>
          </div>
          <div className="precos-grid">
            {/* PLANO ESSENCIAL */}
            <div className="preco-card">
              <div className="preco-card-header">
                <h3>Plano Essencial</h3>
                <p>Para clínicas pequenas</p>
              </div>
              <div className="preco-valor">
                <span className="moeda">R$</span>
                <span className="valor">149</span>
                <span className="periodo">/mês</span>
              </div>
              <p className="preco-limite">1 a 2 dentistas</p>
              <ul className="preco-features">
                <li><span>✔</span> Agenda inteligente</li>
                <li><span>✔</span> Recuperação automática</li>
                <li><span>✔</span> Confirmação de consultas</li>
                <li><span>✔</span> Dashboard básico</li>
              </ul>
              <button onClick={onEnterApp} className="btn-secondary w-full">Começar Agora</button>
            </div>

            {/* PLANO PROFISSIONAL */}
            <div className="preco-card popular">
              <div className="badge-popular">MAIS POPULAR</div>
              <div className="preco-card-header">
                <h3>Plano Profissional</h3>
                <p>O melhor custo-benefício</p>
              </div>
              <div className="preco-valor">
                <span className="moeda">R$</span>
                <span className="valor">299</span>
                <span className="periodo">/mês</span>
              </div>
              <p className="preco-limite">3 a 5 dentistas</p>
              <ul className="preco-features">
                <li><span>✔</span> Tudo do plano Essencial</li>
                <li><span>✔</span> Campanhas automáticas</li>
                <li><span>✔</span> Relatórios de faltas</li>
                <li><span>✔</span> Automação de mensagens</li>
              </ul>
              <button onClick={onEnterApp} className="btn-primary w-full">Começar Agora</button>
            </div>

            {/* PLANO CLÍNICA */}
            <div className="preco-card">
              <div className="preco-card-header">
                <h3>Plano Clínica</h3>
                <p>Para grandes operações</p>
              </div>
              <div className="preco-valor">
                <span className="moeda">R$</span>
                <span className="valor">499</span>
                <span className="periodo">/mês</span>
              </div>
              <p className="preco-limite">6 a 10 dentistas</p>
              <ul className="preco-features">
                <li><span>✔</span> Tudo do plano Profissional</li>
                <li><span>✔</span> Insights da IA Solara</li>
                <li><span>✔</span> Campanhas avançadas</li>
                <li><span>✔</span> Prioridade no suporte</li>
              </ul>
              <button onClick={onEnterApp} className="btn-secondary w-full">Começar Agora</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta">
        <div className="container">
          <div className="cta-inner">
            <div className="section-label teal" style={{ margin: '0 auto 24px', display: 'table' }}>🚀 Comece Agora</div>
            <h2>Comece a recuperar pacientes hoje.</h2>
            <p>Ative o Assistente Solara na sua clínica e permita que a inteligência artificial trabalhe para trazer pacientes de volta automaticamente.</p>
            <div className="cta-btns">
              <button onClick={onEnterApp} className="btn-primary">
                Entrar no Assistente Solara →
              </button>
              <button onClick={onEnterApp} className="btn-white">
                Começar Agora
              </button>
            </div>
            <div className="cta-stats">
              <div className="cta-stat">
                <strong>28%</strong>
                <span>Taxa de recuperação</span>
              </div>
              <div className="cta-stat">
                <strong>R$ 12.480</strong>
                <span>Faturamento médio recuperado</span>
              </div>
              <div className="cta-stat">
                <strong>142</strong>
                <span>Convites automáticos/mês</span>
              </div>
              <div className="cta-stat">
                <strong>24</strong>
                <span>Pacientes recuperados</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src="/sol_com_risco_em_baixo-removebg-preview.png" alt="Assistente Solara Logo" style={{ width: '52px', height: '52px' }} />
              <div className="footer-logo-text">
                <span className="assistente">Assistente</span>
                <span className="solara">Solara</span>
              </div>
            </div>
            <p>IA para recuperação de pacientes em clínicas odontológicas. Tecnologia inteligente a serviço da saúde.</p>
          </div>
          <div className="footer-col">
            <h4>Sistema</h4>
            <ul>
              <li><button onClick={onEnterApp} className="text-left hover:text-[#82ccdd] transition-colors">Login</button></li>
              <li><a href="#solucao">Funcionalidades</a></li>
              <li><a href="#como-funciona">Como Funciona</a></li>
              <li><a href="#demo">Demonstração</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Empresa</h4>
            <ul>
              <li><a href="#">Contato</a></li>
              <li><a href="#">Termos de Uso</a></li>
              <li><a href="#">Privacidade</a></li>
              <li><a href="#">Suporte</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Assistente Solara. Todos os direitos reservados.</p>
          <div className="footer-badge">🔒 Criptografia Militar Ativa</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingView;
