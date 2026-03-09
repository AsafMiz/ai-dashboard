Create a new widget type: $ARGUMENTS

Steps:
1. Create `src/components/charts/{Name}Widget.tsx` as a `'use client'` component accepting `(data: DataRow[], config: WidgetConfig)` from `@/lib/types`
2. Add the new type to the `WidgetType` union in `src/lib/types.ts`
3. Add any new config keys to the `WidgetConfig` interface in `src/lib/types.ts`
4. Import the component and add a `case` to the switch in `src/components/WidgetRenderer.tsx`
5. Add sample data and a `<WidgetPreview>` block to `src/app/api-docs/page.tsx`
6. Add new config fields to the widget config reference table in `docs/guide.md`
7. Verify with `npx next build`
