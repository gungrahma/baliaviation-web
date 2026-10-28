import { communityPillars } from "../data/community";

export function CommunityPillars() {
  return (
    <section className="pillars">
      <div className="pillars-heading">
        <p className="eyebrow"><span className="eyebrow-line" /> The way we fly</p>
        <h2>Built on shared<br />passion.</h2>
      </div>
      <div className="pillar-list">
        {communityPillars.map((pillar) => (
          <article className="pillar" key={pillar.number}>
            <span className="pillar-number">{pillar.number}</span>
            <div>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </div>
            <span className="pillar-plus" aria-hidden="true">↗</span>
          </article>
        ))}
      </div>
    </section>
  );
}
