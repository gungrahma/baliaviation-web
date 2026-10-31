import { communityPillars } from "../data/community";

export function CommunityPillars() {
  return (
    <section className="pillars">
      <div className="pillars-heading">
        <h2>Misi kami<br />di Bali Aviation</h2>
      </div>
      <div className="pillar-list">
        {communityPillars.map((pillar) => (
          <article className="pillar" key={pillar.number}>
            <span className="pillar-number">{pillar.number}</span>
            <div>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
