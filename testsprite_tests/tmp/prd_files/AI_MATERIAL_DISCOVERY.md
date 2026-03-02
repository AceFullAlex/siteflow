# 🧠 AI Material Discovery: Handling Unstructured Site Data

**The Challenge:** SiteFlow operates on a "Just-In-Time" construction site where materials are random, vendors vary daily, and documents are often in different languages (e.g., German). There is **no master material database**.

---

## 1. The "Discovery-Based" Strategy
Traditional logistics apps fail because they require a rigid "Material Catalog." SiteFlow uses **AI Discovery**, which builds the catalog *as deliveries arrive*.

### How the AI "Learns" Your Site:
1.  **Semantic Translation:** If a delivery note arrives in German saying *"Bewehrungsstahl"* (Reinforcement Steel), Gemini instantly translates it and logs it in English as "Steel Reinforcement".
2.  **Fuzzy Tagging:** The AI looks at the text and assigns broad tags (e.g., `Mechanical`, `Electrical`, `Groundworks`) based on general construction knowledge, even if it has never seen that specific part number before.
3.  **Dynamic Vocabulary:** When Gemini sees the same vendor's weird part name three times, it "learns" that `V-SHAPED PIPE-X1` is actually a `45 Degree PVC Bend`. It begins to normalize these names in your Daily Reports.
4.  **Unstructured Capture:** We don't force the unloader to pick from a list. We let them take a photo. AI handles the "messy" data extraction so the manager sees a clean, uniform list.

---

## 2. Competitive Edge: SiteFlow vs. Procore
| Feature | Traditional Apps (Procore/Fieldwire) | SiteFlow (Discovery-AI) |
|---------|--------------------------------------|-------------------------|
| **Setup** | Requires weeks of catalog data entry | Works day 1 with ZERO data entry |
| **Vendors** | Must be pre-approved in the system | Accepts any random vendor on the fly |
| **Language** | Hard-coded to one language | Auto-translates German/French/etc. |
| **Fuzzy Match** | Fails if the ID doesn't match exactly | Semantic matching (Steel = Rebar) |

---

## 3. Future "Self-Learning" Roadmap
- **Vendor Reliability Scoring:** AI observes that "Vendor A" always has missing CMRs and starts flagging their deliveries as `HIGH RISK` automatically.
- **Auto-Aggregating Materials:** After 1 month, SiteFlow generates a "Site Inventory Sheet" for you, essentially building the database you never had.
- **Shortage Prediction:** AI notices you are receiving a lot of "Pipes" but no "Connectors" and asks: *"Did we forget the connectors for these pipes?"*
