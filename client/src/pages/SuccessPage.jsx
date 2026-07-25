import { useState } from "react";
import { Link } from "react-router";

const CONTRACT = "0x4aB3c1F2e8D90721cC4f3Ea2";
const TX_HASH   = "0xf7c2...3Bd9A1e4F802cD56";

const stripeData = ["","r","y","","","r","y","","","r","y","","r","y"];
const pills = ["Tamper-proof","Transparent","UIDAI Verified","Polygon PoS"];

export default function SuccessPage({hash,aadher}) {
  const [aadhaar, setAadhaar] = useState("");
  const [copiedC, setCopiedC] = useState(false);
  const [copiedT, setCopiedT] = useState(false);
  const [checking, setChecking] = useState(false);
  const [done, setDone] = useState(false);

  const fmt = (v) => v.replace(/\D/g,"").slice(0,12).replace(/(\d{4})(?=\d)/g,"$1 ");

  const copy = (text, which) => {
    navigator.clipboard.writeText(text).catch(()=>{});
    if (which === "c") { setCopiedC(true); setTimeout(()=>setCopiedC(false),2000); }
    else               { setCopiedT(true); setTimeout(()=>setCopiedT(false),2000); }
  };

  const handleCheck = () => {
    if (aadhaar.replace(/\s/g,"").length !== 12) return;
    setChecking(true);
    setTimeout(()=>{ setChecking(false); setDone(true); },1800);
  };

  const CopyIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );

  const CheckIcon = ({ color = "currentColor" }) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const ExternalIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lc-page {
          min-height: 100vh;
          background: #f0eeea;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          font-family: 'Outfit', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .lc-page::before {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
        }

        /* ── CARD ── */
        .lc-card {
          position: relative; z-index: 2;
          width: 100%; max-width: 520px;
          background: #fff;
          border: 2px solid #111;
          border-radius: 4px;
          padding: 36px 32px 32px;
          box-shadow: 5px 5px 0px #111;
        }

        /* top stripe */
        .lc-stripe {
          position: absolute; top: 0; left: 0; right: 0;
          height: 5px; display: flex; overflow: hidden;
        }
        .lc-cs       { flex: 1; background: #e8e4dc; }
        .lc-cs.y     { background: #F0C020; }
        .lc-cs.r     { background: #D02020; }

        /* ── LOGO ── */
        .lc-logo-row {
          display: flex; align-items: center; justify-content: center;
          gap: 10px; margin-bottom: 20px;
        }
        .lc-logo-shapes { display: flex; align-items: center; gap: 4px; }
        .lc-lc { width: 14px; height: 14px; border-radius: 50%; background: #D02020; border: 2px solid #111; }
        .lc-ls { width: 12px; height: 12px; background: #F0C020; border: 2px solid #111; }
        .lc-lt { width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-bottom: 12px solid #111; }
        .lc-logo-name {
          font-size: 13px; font-weight: 900; letter-spacing: 3px;
          text-transform: uppercase; color: #111;
        }

        /* ── HEADER ── */
        .lc-header { text-align: center; margin-bottom: 28px; }
        .lc-check-circle {
          width: 70px; height: 70px; border-radius: 50%;
          background: #22c55e;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 18px;
          border: 2px solid #111;
          box-shadow: 3px 3px 0 #111;
        }
        .lc-heading {
          font-size: 26px; font-weight: 900; color: #111;
          margin-bottom: 8px; letter-spacing: -0.5px; text-transform: uppercase;
        }
        .lc-heading .accent { color: #D02020; }
        .lc-sub { font-size: 13px; color: #555; line-height: 1.55; font-weight: 400; }

        /* ── INFO BOX ── */
        .lc-info-box {
          background: #f8f6f2;
          border: 2px solid #111;
          border-radius: 3px;
          padding: 14px 16px;
          margin-bottom: 12px;
          box-shadow: 3px 3px 0 #e0ddd6;
        }
        .lc-ib-top {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 6px;
        }
        .lc-ib-label {
          display: flex; align-items: center; gap: 7px;
          font-size: 10px; font-weight: 800; letter-spacing: 1.5px;
          text-transform: uppercase; color: #111;
        }
        .lc-ib-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #F0C020; border: 1.5px solid #111;
        }
        .lc-ib-actions { display: flex; gap: 6px; }
        .lc-ib-btn {
          width: 30px; height: 30px;
          background: #fff;
          border: 1.5px solid #111;
          border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.12s, box-shadow 0.1s, transform 0.1s;
          color: #111;
          box-shadow: 2px 2px 0 #111;
        }
        .lc-ib-btn:hover  { background: #f0eeea; }
        .lc-ib-btn:active { box-shadow: none; transform: translate(2px,2px); }
        .lc-ib-btn.copied {
          background: #dcfce7; border-color: #16a34a;
          color: #16a34a; box-shadow: 2px 2px 0 #16a34a;
        }
        .lc-ib-value {
          font-size: 13px; font-weight: 600; color: #333;
          font-family: monospace; letter-spacing: 0.5px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        /* ── DIVIDER ── */
        .lc-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 20px 0 16px;
        }
        .lc-divider-line { flex: 1; height: 2px; background: #111; }
        .lc-divider-text {
          font-size: 9px; font-weight: 800; letter-spacing: 2px;
          text-transform: uppercase; color: #111;
          background: #fff; padding: 0 8px;
          border: 1.5px solid #111; border-radius: 2px;
        }

        /* ── INPUT ── */
        .lc-input-label {
          display: block; font-size: 9px; font-weight: 800;
          letter-spacing: 2px; text-transform: uppercase;
          color: #666; margin-bottom: 8px;
        }
        .lc-input-wrap { position: relative; margin-bottom: 14px; }
        .lc-input-wrap input {
          width: 100%;
          background: #fff;
          border: 2px solid #111;
          border-radius: 3px;
          padding: 14px 48px 14px 44px;
          font-size: 14px; font-weight: 600;
          color: #111; font-family: 'Outfit', sans-serif;
          outline: none; letter-spacing: 2px;
          transition: box-shadow 0.15s;
          box-shadow: 3px 3px 0 #ccc;
        }
        .lc-input-wrap input::placeholder { color: #aaa; letter-spacing: 0.5px; font-size: 13px; font-weight: 400; }
        .lc-input-wrap input:focus { box-shadow: 3px 3px 0 #F0C020; border-color: #111; }
        .lc-input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); pointer-events: none; }
        .lc-char-count {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          font-size: 9px; font-weight: 700; color: #aaa; font-family: monospace;
        }

        /* ── CTA BUTTON ── */
        .lc-cta-btn {
          width: 100%; padding: 14px;
          background: #D02020;
          border: 2px solid #111; border-radius: 3px;
          color: #fff; font-size: 12px; font-weight: 900;
          letter-spacing: 2.5px; text-transform: uppercase;
          font-family: 'Outfit', sans-serif; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: transform 0.1s, box-shadow 0.1s, background 0.12s;
          box-shadow: 4px 4px 0 #111;
        }
        .lc-cta-btn:hover  { background: #b01818; }
        .lc-cta-btn:active { box-shadow: none; transform: translate(4px,4px); }
        .lc-cta-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: 4px 4px 0 #111; }

        /* dot loader */
        .lc-dot-loader { display: flex; gap: 4px; align-items: center; }
        .lc-dot-loader span {
          width: 5px; height: 5px; border-radius: 50%; background: #fff;
          animation: lc-db 0.8s ease-in-out infinite;
        }
        .lc-dot-loader span:nth-child(2) { animation-delay: 0.15s; }
        .lc-dot-loader span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes lc-db {
          0%,80%,100% { transform: translateY(0); opacity: .4; }
          40%          { transform: translateY(-5px); opacity: 1; }
        }

        /* ── RESULT BANNER ── */
        .lc-result-banner {
          margin-top: 12px;
          background: #dcfce7;
          border: 2px solid #16a34a; border-radius: 3px;
          padding: 10px 14px;
          display: flex; align-items: center; gap: 10px;
          font-size: 11px; font-weight: 800; letter-spacing: 1px;
          text-transform: uppercase; color: #15803d;
          box-shadow: 3px 3px 0 #16a34a;
        }

        /* ── FOOTER ── */
        .lc-footer-note {
          text-align: center; margin-top: 20px;
          font-size: 11px; color: #888;
          line-height: 1.6; font-weight: 400; max-width: 380px;
        }

        /* ── TRUST PILLS ── */
        .lc-trust-row {
          display: flex; align-items: center; justify-content: center;
          gap: 6px; flex-wrap: wrap; margin-top: 16px;
        }
        .lc-trust-pill {
          font-size: 8px; font-weight: 800; letter-spacing: 1.5px;
          text-transform: uppercase;
          background: #fff; border: 1.5px solid #111;
          border-radius: 2px; padding: 3px 9px; color: #111;
        }
        .lc-sep { width: 3px; height: 3px; border-radius: 50%; background: #ccc; }

        @media (max-width: 480px) {
          .lc-card { padding: 28px 18px 24px; }
        }
      `}</style>

      <div className="lc-page">
        <div className="lc-card">

          {/* top stripe */}
          <div className="lc-stripe">
            {stripeData.map((t, i) => (
              <div key={i} className={`lc-cs${t === "y" ? " y" : t === "r" ? " r" : ""}`} />
            ))}
          </div>

          {/* LOGO */}
          <div className="lc-logo-row">
            <div className="lc-logo-shapes">
              <div className="lc-lc" /><div className="lc-ls" /><div className="lc-lt" />
            </div>
            <span className="lc-logo-name">Landchain</span>
          </div>

          {/* HEADER */}
          <div className="lc-header">
            <div className="lc-check-circle">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="lc-heading">
              Verified <span className="accent">Successfully!</span>
            </h1>
            <p className="lc-sub">
              Your land record has been verified on-chain and is now live on the network.
            </p>
          </div>

          {/* CONTRACT ADDRESS */}
          <div className="lc-info-box">
            <div className="lc-ib-top">
              <div className="lc-ib-label">
                <span className="lc-ib-dot" />
                Aadher No
              </div>
              <div className="lc-ib-actions">
                <div className={`lc-ib-btn${copiedC ? " copied" : ""}`} onClick={() => copy(CONTRACT, "c")} title="Copy">
                  {copiedC ? <CheckIcon /> : <CopyIcon />}
                </div>
                <div className="lc-ib-btn" title="View on Explorer"><ExternalIcon /></div>
              </div>
            </div>
            <div className="lc-ib-value">{aadher}</div>
          </div>

          {/* TRANSACTION HASH */}
          <div className="lc-info-box">
            <div className="lc-ib-top">
              <div className="lc-ib-label">
                <span className="lc-ib-dot" />
                Transaction Hash
              </div>
              <div className="lc-ib-actions">
                <div className={`lc-ib-btn${copiedT ? " copied" : ""}`} onClick={() => copy(TX_HASH, "t")} title="Copy">
                  {copiedT ? <CheckIcon /> : <CopyIcon />}
                </div>
                <div className="lc-ib-btn" title="View on Explorer"><ExternalIcon /></div>
              </div>
            </div>
            <div className="lc-ib-value">{hash}</div>
          </div>

          {/* DIVIDER */}
          <div className="lc-divider">
            <div className="lc-divider-line" />
            <span className="lc-divider-text">Check Asset</span>
            <div className="lc-divider-line" />
          </div>
          {/* AADHAAR INPUT */}

          {/* CTA BUTTON */}
          <Link to="/"><button className="lc-cta-btn" onClick={handleCheck} disabled={checking}>
            <span style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:9 }}>
             
                  Home Page
              
            </span>
          </button></Link>

          {/* RESULT */}
          {done && (
            <div className="lc-result-banner">
              <CheckIcon color="#15803d" />
              Record Found — Redirecting to Portal
            </div>
          )}
        </div>

        {/* FOOTER */}
        <p className="lc-footer-note">
          Your land record is live and verified on-chain. Share the contract address with your community!
        </p>

        {/* TRUST PILLS */}
        <div className="lc-trust-row">
          {pills.map((t, i, a) => (
            <span key={t}>
              <span className="lc-trust-pill">{t}</span>
              {i < a.length - 1 && <span className="lc-sep" />}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
