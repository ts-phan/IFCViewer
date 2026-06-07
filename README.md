# Audit BIM — Visionneuse IFC & BCF

> Application PWA de terrain pour la visualisation de maquettes IFC et l'annotation d'audits au format BCF 2.1.

---


## Fonctionnalités

| Fonctionnalité | Détail |
|---|---|
| Visualisation IFC | Chargement `.ifc` / `.ifczip` via web-ifc-viewer |
| Annotations | Double-clic → capture 3D + formulaire titre/desc/type |
| Marqueurs 3D | Sphères rouges positionnées dans la scène |
| Export BCF 2.1 | ZIP conforme BCF avec markup, viewpoint et snapshot |
| Import BCF | Lecture `.bcfzip` avec reconstruction des marqueurs |
| PWA offline | Service Worker + manifeste pour installation mobile |
| Persistance | Sauvegarde automatique dans `localStorage` |

---