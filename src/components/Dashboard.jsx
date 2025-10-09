import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Plus, Search } from 'lucide-react';
import Header from './Header';
import GroupTree from './GroupTree';
import CommandEditorModal from './CommandEditorModal';
import GroupModal from './GroupModal';

export default function Dashboard({ user, onLogout }) {
  const [groups, setGroups] = useState([]);
  const [commands, setCommands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCommandModalOpen, setIsCommandModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [parentIdForSubgroup, setParentIdForSubgroup] = useState(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createDefaultGroups = async () => {
    const defaultGroups = ['Salesforce', 'Git', 'npm'];

    try {
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

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error creating default groups:', error);
      return [];
    }
  };

  const fetchData = async () => {
    try {
      const [groupsRes, commandsRes] = await Promise.all([
        supabase
          .from('groups')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at'),
        supabase.from('commands').select('*').order('created_at')
      ]);

      if (groupsRes.error) throw groupsRes.error;
      if (commandsRes.error) throw commandsRes.error;

      let groupsData = groupsRes.data || [];

      // If user has no groups, create default ones
      if (groupsData.length === 0) {
        const defaultGroupsData = await createDefaultGroups();
        groupsData = defaultGroupsData;
      }

      setGroups(groupsData);
      setCommands(commandsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGroup = () => {
    setParentIdForSubgroup(null);
    setIsGroupModalOpen(true);
  };

  const handleAddSubgroup = (parentId) => {
    setParentIdForSubgroup(parentId);
    setIsGroupModalOpen(true);
  };

  const handleSaveGroup = async (name) => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .insert([{ name, user_id: user.id, parent_id: parentIdForSubgroup }])
        .select();

      if (error) throw error;
      setGroups([...groups, ...data]);
    } catch (error) {
      console.error('Error adding group:', error);
      alert('Failed to add group');
    }
  };

  const handleEditGroup = async (groupId, newName) => {
    try {
      const { error } = await supabase
        .from('groups')
        .update({ name: newName })
        .eq('id', groupId);

      if (error) throw error;
      setGroups(
        groups.map((g) => (g.id === groupId ? { ...g, name: newName } : g))
      );
    } catch (error) {
      console.error('Error editing group:', error);
      alert('Failed to edit group');
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!confirm('Delete this group and all its contents?')) return;

    try {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId);
      if (error) throw error;

      setGroups(groups.filter((g) => g.id !== groupId));
      setCommands(commands.filter((c) => c.group_id !== groupId));
    } catch (error) {
      console.error('Error deleting group:', error);
      alert('Failed to delete group');
    }
  };

  const handleSaveCommand = async (commandData) => {
    try {
      if (commandData.id) {
        // Update existing
        const { error } = await supabase
          .from('commands')
          .update({
            title: commandData.title,
            command_text: commandData.command_text
          })
          .eq('id', commandData.id);

        if (error) throw error;
        setCommands(
          commands.map((c) =>
            c.id === commandData.id
              ? {
                  ...c,
                  title: commandData.title,
                  command_text: commandData.command_text
                }
              : c
          )
        );
      } else {
        // Create new
        const { data, error } = await supabase
          .from('commands')
          .insert([
            {
              group_id: commandData.group_id,
              title: commandData.title,
              command_text: commandData.command_text
            }
          ])
          .select();

        if (error) throw error;
        setCommands([...commands, ...data]);
      }
    } catch (error) {
      console.error('Error saving command:', error);
      alert('Failed to save command');
    }
  };

  const handleDeleteCommand = async (commandId) => {
    if (!confirm('Delete this command?')) return;

    try {
      const { error } = await supabase
        .from('commands')
        .delete()
        .eq('id', commandId);
      if (error) throw error;
      setCommands(commands.filter((c) => c.id !== commandId));
    } catch (error) {
      console.error('Error deleting command:', error);
      alert('Failed to delete command');
    }
  };

  const handleMoveCommand = async (commandId, newGroupId) => {
    try {
      const { error } = await supabase
        .from('commands')
        .update({ group_id: newGroupId })
        .eq('id', commandId);

      if (error) throw error;
      setCommands(
        commands.map((c) =>
          c.id === commandId ? { ...c, group_id: newGroupId } : c
        )
      );
    } catch (error) {
      console.error('Error moving command:', error);
      alert('Failed to move command');
    }
  };

  const openCommandModal = (groupId, command = null) => {
    setSelectedGroupId(groupId);
    setSelectedCommand(command);
    setIsCommandModalOpen(true);
  };

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.command_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rootGroups = groups.filter((g) => !g.parent_id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header onLogout={onLogout} userEmail={user.email} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="Search commands..."
            />
          </div>
          <button
            onClick={handleAddGroup}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition shadow-lg cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            New Group
          </button>
        </div>

        {rootGroups.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-gray-400 mb-4">No command groups yet</p>
            <button
              onClick={handleAddGroup}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Create Your First Group
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {rootGroups.map((group) => (
              <GroupTree
                key={group.id}
                group={group}
                commands={searchTerm ? filteredCommands : commands}
                subgroups={groups}
                onAddCommand={openCommandModal}
                onEditCommand={(cmd) => openCommandModal(cmd.group_id, cmd)}
                onDeleteCommand={handleDeleteCommand}
                onAddSubgroup={handleAddSubgroup}
                onEditGroup={handleEditGroup}
                onDeleteGroup={handleDeleteGroup}
                onMoveCommand={handleMoveCommand}
              />
            ))}
          </div>
        )}
      </div>

      <CommandEditorModal
        isOpen={isCommandModalOpen}
        onClose={() => {
          setIsCommandModalOpen(false);
          setSelectedCommand(null);
          setSelectedGroupId(null);
        }}
        onSave={handleSaveCommand}
        command={selectedCommand}
        groupId={selectedGroupId}
      />

      <GroupModal
        isOpen={isGroupModalOpen}
        onClose={() => {
          setIsGroupModalOpen(false);
          setParentIdForSubgroup(null);
        }}
        onSave={handleSaveGroup}
        title={parentIdForSubgroup ? 'New Subgroup' : 'New Group'}
      />
    </div>
  );
}
