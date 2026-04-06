export 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .hero-page-reset {
    display: contents; /* transparent in layout, children behave as direct children of parent */
  }

  .hero-wrap {
    font-family: 'DM Sans', sans-serif;
    position: fixed;
    top: 57px; 
    left: 0;
    right: 0;
    bottom: 0;
    background: #f8f7f4;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 0;
  }

  .hero-wrap::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, #c5c5be 1px, transparent 1px);
    background-size: 28px 28px;
    opacity: 0.45;
    pointer-events: none;
  }

  .circle-accent {
    position: absolute;
    width: 650px;
    height: 650px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #dbeafe, #eff6ff 55%, transparent 80%);
    top: -200px;
    right: -180px;
    pointer-events: none;
  }

  .smear-accent {
    position: absolute;
    width: 500px;
    height: 340px;
    border-radius: 50%;
    background: radial-gradient(ellipse, #bfdbfe 0%, transparent 70%);
    bottom: -100px;
    left: -100px;
    pointer-events: none;
    opacity: 0.55;
  }

  .hero-inner {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0 24px;
    width: 100%;
    max-width: 860px;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: #fff;
    border: 1px solid #e0e0d8;
    border-radius: 100px;
    padding: 6px 16px;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #2563eb;
    margin-bottom: 36px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    animation: fade-up 0.7s ease both;
  }

  .badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #3b82f6;
    animation: blink 1.6s ease-in-out infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.25; }
  }

  .hero-headline {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2.8rem, 6.5vw, 5.8rem);
    font-weight: 800;
    line-height: 1.02;
    letter-spacing: -0.03em;
    color: #0f172a;
    margin: 0;
    animation: fade-up 0.75s 0.08s ease both;
  }

  .hero-headline .accent {
    background: linear-gradient(120deg, #1d4ed8 0%, #3b82f6 50%, #60a5fa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-sub {
    margin-top: 28px;
    font-size: clamp(1rem, 1.8vw, 1.15rem);
    font-weight: 300;
    color: #64748b;
    line-height: 1.75;
    max-width: 440px;
    animation: fade-up 0.8s 0.16s ease both;
  }

  .hero-cta-row {
    margin-top: 44px;
    display: flex;
    align-items: center;
    gap: 14px;
    animation: fade-up 0.85s 0.24s ease both;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 16px 36px;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.97rem;
    font-weight: 500;
    cursor: pointer;
    border: none;
    background: #1d4ed8;
    color: #fff;
    box-shadow: 0 4px 20px rgba(29,78,216,0.28), 0 1px 3px rgba(29,78,216,0.2);
    transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
    position: relative;
    overflow: hidden;
  }

  .btn-primary::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
    pointer-events: none;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    background: #1e40af;
    box-shadow: 0 8px 30px rgba(29,78,216,0.38), 0 2px 6px rgba(29,78,216,0.2);
  }
  .btn-primary:active { transform: translateY(0); }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 16px 28px;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.97rem;
    font-weight: 500;
    cursor: pointer;
    border: 1.5px solid #e2e8f0;
    background: #fff;
    color: #334155;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    transition: border-color 0.16s, box-shadow 0.16s, transform 0.16s;
  }
  .btn-secondary:hover {
    border-color: #cbd5e1;
    box-shadow: 0 4px 14px rgba(0,0,0,0.09);
    transform: translateY(-1px);
  }

  .google-icon { width: 18px; height: 18px; flex-shrink: 0; }

  .stats-row {
    display: flex;
    align-items: center;
    margin-top: 52px;
    animation: fade-up 0.9s 0.32s ease both;
    background: #fff;
    border: 1px solid #e8e8e2;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.05);
    overflow: hidden;
  }

  .stat {
    padding: 20px 44px;
    text-align: center;
    position: relative;
  }

  .stat + .stat::before {
    content: '';
    position: absolute;
    left: 0; top: 18%; height: 64%;
    width: 1px;
    background: #e8e8e2;
  }

  .stat-val {
    font-family: 'Syne', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.02em;
  }
  .stat-val .blue { color: #2563eb; }

  .stat-lbl {
    font-size: 0.72rem;
    color: #94a3b8;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-top: 3px;
  }

  .coin {
    position: absolute;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-family: 'Syne', sans-serif;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    pointer-events: none;
    z-index: 1;
    user-select: none;
  }

  .coin-btc {
    width: 72px; height: 72px;
    background: linear-gradient(135deg, #fde68a, #f59e0b);
    color: #fff; font-size: 0.88rem;
    top: 14%; right: 11%;
    animation: float 5s ease-in-out infinite;
  }
  .coin-eth {
    width: 56px; height: 56px;
    background: linear-gradient(135deg, #c4b5fd, #7c3aed);
    color: #fff; font-size: 0.75rem;
    top: 58%; right: 7%;
    animation: float 6.5s 1s ease-in-out infinite;
  }
  .coin-sol {
    width: 50px; height: 50px;
    background: linear-gradient(135deg, #6ee7b7, #059669);
    color: #fff; font-size: 0.7rem;
    top: 22%; left: 8%;
    animation: float 7s 0.5s ease-in-out infinite;
  }
  .coin-inr {
    width: 60px; height: 60px;
    background: linear-gradient(135deg, #fca5a5, #ef4444);
    color: #fff; font-size: 1.1rem;
    top: 62%; left: 10%;
    animation: float 5.5s 1.5s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(-2deg); }
    50%       { transform: translateY(-14px) rotate(2deg); }
  }

  @keyframes fade-up {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 640px) {
    .coin { display: none; }
    .stats-row { flex-direction: column; width: 90%; }
    .stat + .stat::before { display: none; }
    .stat { padding: 16px 32px; }
    .hero-cta-row { flex-direction: column; width: 100%; }
    .btn-primary, .btn-secondary { width: 100%; justify-content: center; }
  }
`;
