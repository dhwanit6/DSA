# Soft Publish Plan

## 1. Product Boundary

This app is a focused interview-prep product, not a general CS encyclopedia.

Current scope:

1. DSA roadmap and problem practice
2. CS fundamentals for interviews
3. Interview execution: OA, mocks, behavioral, final review

Current non-goals:

1. full OS or networking specialization tracks
2. AI-personalized coaching
3. region-specific product variants in the UI
4. deep analytics dashboards
5. community features beyond lightweight feedback collection

Do not add new major sections until soft-publish feedback is reviewed.

## 2. Release Gate

Before a soft publish, these must stay green:

1. `npm run test:run`
2. `npm run lint`
3. `npm run qa:content`
4. `npm run build`
5. `npm run test:e2e`

If any of these fail, fix stability before changing content or design.

## 3. Soft Publish Rollout

Week 1:

1. Share with 5 to 10 students or early-career engineers.
2. Ask them to complete one onboarding flow, one chapter, one planner action, and one dashboard update.
3. Collect only confusion points, broken flows, and missing explanations.

Week 2:

1. Fix repeated friction.
2. Do not add new content lanes unless the feedback clearly says a current lane is insufficient.
3. Publish again to a slightly wider group.

## 4. What Feedback To Collect

Ask only these questions:

1. Where did you feel lost?
2. Which chapter felt too dense or too thin?
3. Which page made you stop or bounce?
4. Did the planner feel actionable or generic?
5. Did progress tracking match your sense of real effort?

## 5. Decision Rule

No new product expansion until at least 15 meaningful feedback entries are collected and triaged.

Priority order:

1. broken flows
2. misleading guidance
3. weak explanations in high-traffic chapters
4. polish improvements
5. new features
