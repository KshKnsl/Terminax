import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, GitFork, GitBranch, Lock, Unlock, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DotPattern } from '@/components/magicui/dot-pattern';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

interface Repository {
    id: number;
    name: string;
    full_name: string;
    private: boolean;
    description: string | null;
    html_url: string;
    languageUrl: string;
    default_branch: string;
    branches_url: string;
    url: string;
    avatar_url?: string;
    commitHistory: string;
}

interface GithubRepoSelectorProps {
    onSelect?: (repo: Repository) => void;
}

const GithubRepoSelector: React.FC<GithubRepoSelectorProps> = ({ onSelect }) => {
    const [repoList, setRepoList] = useState<Repository[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRepositories = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`${SERVER_URL}/github/repositories`, {
                    credentials: 'include',
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch repositories');
                }
                
                const data = await response.json();
                
                if (data.success) {
                    const repoData = data.repositories.map((repo: any) => ({
                        id: repo.id,
                        name: repo.name,
                        full_name: repo.full_name,
                        private: repo.private,
                        description: repo.description,
                        html_url: repo.html_url,
                        languageUrl: repo.languages_url,
                        default_branch: repo.default_branch,
                        branches_url: repo.branches_url,
                        url: repo.url,
                        avatar_url: repo.owner.avatar_url,
                        commitHistory: repo.url+'/commits',
                    }));
                    setRepoList(repoData);
                } else {
                    throw new Error(data.error || 'Failed to fetch repositories');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Error fetching repositories:', err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchRepositories();
    }, []);

    const filteredRepos = repoList.filter(repo =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 relative">
            <div className="absolute inset-0 overflow-hidden -z-10">
                <DotPattern
                    width={20}
                    height={20}
                    cx={1}
                    cy={1}
                    cr={0.8}
                    className="absolute inset-0 w-full h-full opacity-30"
                />
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
                <input
                    type="text"
                    placeholder="Search repositories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
                {filteredRepos.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                        No repositories found
                    </p>
                ) : (
                    filteredRepos.map((repo) => (
                        <div
                            key={repo.id}
                            onClick={() => onSelect?.(repo)}
                            className={cn(
                                "relative p-6 rounded-xl border border-gray-200 dark:border-gray-800",
                                "hover:border-purple-500 dark:hover:border-purple-500 cursor-pointer",
                                "bg-white dark:bg-[#0A0A0A] transition-all duration-200",
                                "hover:shadow-lg hover:shadow-purple-500/10",
                                "space-y-4 group"
                            )}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                                        {repo.avatar_url ? (
                                            <img 
                                                src={repo.avatar_url} 
                                                alt="Repository owner" 
                                                className="w-10 h-10 rounded-lg"
                                            />
                                        ) : (
                                            <Terminal className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                                {repo.name}
                                            </h3>
                                            {repo.private ? (
                                                <Lock className="w-4 h-4 text-amber-500" />
                                            ) : (
                                                <Unlock className="w-4 h-4 text-green-500" />
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {repo.full_name}
                                        </p>
                                    </div>
                                </div>
                                <a 
                                    href={repo.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-full transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4 text-purple-500" />
                                </a>
                            </div>

                            {repo.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                                    {repo.description}
                                </p>
                            )}

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                        <GitBranch className="w-4 h-4 text-purple-500" />
                                        <span>Branch: <span className="font-mono bg-purple-100 dark:bg-purple-900/20 px-1.5 py-0.5 rounded text-purple-700 dark:text-purple-300">{repo.default_branch}</span></span>
                                    </div>
                                </div>
                                <div>
                                    <a
                                        href={repo.commitHistory}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
                                    >
                                        <GitFork className="w-4 h-4" />
                                        <span>View commits</span>
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 text-sm">
                                <a
                                    href={repo.languageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
                                >
                                    View languages
                                </a>
                                <span className="text-gray-500 dark:text-gray-400 font-mono">
                                    #{repo.id}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GithubRepoSelector;