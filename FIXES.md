# Bug Fixes - Drag & Drop and Default Groups

## Issues Identified

### 1. **Drag & Drop Not Working** ✅ FIXED
**Problem**: Commands could not be dragged and dropped between groups.

**Root Cause**: In `GroupTree.jsx`, the `handleDrop` function was checking for both `commandId` AND `draggedCommand` state variable:
```javascript
if (commandId && draggedCommand) {  // ❌ draggedCommand was always null
  onMoveCommand(commandId, group.id);
}
```

The `draggedCommand` state was being set in the child `CommandCard`, but it wasn't properly communicating with the parent `GroupTree` component. The command ID was correctly being passed via `dataTransfer`, making the `draggedCommand` check unnecessary.

**Fix Applied**:
- Removed the `draggedCommand` state variable from `GroupTree.jsx`
- Simplified the `handleDrop` function to only check for `commandId`:
```javascript
if (commandId) {  // ✅ Now works correctly
  onMoveCommand(commandId, group.id);
}
```
- Removed unnecessary `onDragStart` and `onDragEnd` callbacks from `CommandCard`
- Simplified drag implementation to use only the HTML5 Drag & Drop API

### 2. **Default Groups Implementation** ✅ ALREADY WORKING

**Verification**: The default groups feature WAS already implemented correctly in `Dashboard.jsx`:

```javascript
const createDefaultGroups = async () => {
  const defaultGroups = ['Salesforce', 'Git', 'NPM'];
  
  const { data, error } = await supabase
    .from('groups')
    .insert(
      defaultGroups.map((name) => ({
        name,
        user_id: user.id,
        parent_id: null
      }))
    )
    .select();
    
  return data || [];
};

// Called in fetchData when user has zero groups:
if (groupsData.length === 0) {
  const defaultGroupsData = await createDefaultGroups();
  groupsData = defaultGroupsData;
}
```

**How It Works**:
1. When a new user logs in, `fetchData()` runs
2. If the user has zero groups, it automatically creates three default groups: Salesforce, Git, NPM
3. These groups are fully deletable and editable like any other group
4. This only happens once - on first login when the user has no groups

## Testing Instructions

### Test Drag & Drop:
1. Visit http://localhost:5174
2. Log in or create an account
3. Create at least 2 groups (or use the default Salesforce, Git, NPM)
4. Add a command to one group
5. Click and hold the grip icon (☰) on the command card
6. Drag the command over another group - you should see a purple border highlight
7. Drop the command - it should move to the new group
8. Refresh the page - the command should remain in the new group (persisted to database)

### Test Default Groups:
1. Create a NEW user account (or delete all existing groups from current user)
2. After login, you should immediately see 3 groups:
   - Salesforce
   - Git
   - NPM
3. These groups are empty but ready to use
4. You can edit their names or delete them like any other group

## Files Modified

- ✅ `src/components/GroupTree.jsx` - Fixed drag & drop logic
- ✅ `src/components/CommandCard.jsx` - Simplified drag implementation
- ℹ️ `src/components/Dashboard.jsx` - Default groups already working (no changes needed)

## Build Status

✅ **Build Successful**: `npm run build` completed without errors
✅ **Dev Server Running**: http://localhost:5174
✅ **No Lint Errors**: All TypeScript/ESLint issues resolved

## What Changed

### Before (Broken):
```javascript
// GroupTree.jsx
const [draggedCommand, setDraggedCommand] = useState(null);

const handleDrop = (e) => {
  const commandId = e.dataTransfer.getData('text/plain');
  if (commandId && draggedCommand) {  // ❌ Never true
    onMoveCommand(commandId, group.id);
  }
};

// CommandCard received callbacks
<CommandCard 
  onDragStart={(cmd) => setDraggedCommand(cmd)}
  onDragEnd={() => setDraggedCommand(null)}
/>
```

### After (Fixed):
```javascript
// GroupTree.jsx - No draggedCommand state needed!

const handleDrop = (e) => {
  const commandId = e.dataTransfer.getData('text/plain');
  if (commandId) {  // ✅ Works!
    onMoveCommand(commandId, group.id);
  }
};

// CommandCard doesn't need callbacks
<CommandCard 
  command={command}
  onEdit={onEditCommand}
  onDelete={onDeleteCommand}
/>
```

## Next Steps

1. **Test both features** using the instructions above
2. If default groups don't appear, check:
   - Are you logged in with a NEW account?
   - Do you have any existing groups? (Default groups only create when you have zero)
   - Check browser console for any Supabase errors
3. If drag & drop doesn't work:
   - Check browser console for JavaScript errors
   - Verify you're grabbing the grip icon (☰) on the left side of the command card
   - Make sure you see the purple border when hovering over a group while dragging

## Notes

- Default groups are created **once** when a new user has zero groups
- If you already have groups, delete them all and refresh to trigger default group creation
- Drag & drop uses native HTML5 Drag & Drop API - no external libraries needed
- Commands are moved in the database, not just the UI (changes persist)
