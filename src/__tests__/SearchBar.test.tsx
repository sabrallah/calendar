import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '../components/SearchBar';

describe('SearchBar component', () => {
  const mockOnSearch = jest.fn();
  const mockOnSortChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders correctly in collapsed state', () => {
    render(
      <SearchBar 
        searchQuery="" 
        onSearch={mockOnSearch} 
        sortMode="updatedAt" 
        onSortChange={mockOnSortChange} 
      />
    );
    
    // Search button should be visible
    expect(screen.getByLabelText('Ouvrir la recherche')).toBeInTheDocument();
    
    // Input should not be visible
    expect(screen.queryByPlaceholderText('Rechercher des notes...')).not.toBeInTheDocument();
  });
  
  it('expands when search button is clicked', () => {
    render(
      <SearchBar 
        searchQuery="" 
        onSearch={mockOnSearch} 
        sortMode="updatedAt" 
        onSortChange={mockOnSortChange} 
      />
    );
    
    // Click search button
    fireEvent.click(screen.getByLabelText('Ouvrir la recherche'));
    
    // Input should now be visible
    expect(screen.getByPlaceholderText('Rechercher des notes...')).toBeInTheDocument();
  });
  
  it('calls onSearch when submitting search', () => {
    render(
      <SearchBar 
        searchQuery="" 
        onSearch={mockOnSearch} 
        sortMode="updatedAt" 
        onSortChange={mockOnSortChange} 
      />
    );
    
    // Click search button to expand
    fireEvent.click(screen.getByLabelText('Ouvrir la recherche'));
    
    // Type in search box
    const searchInput = screen.getByPlaceholderText('Rechercher des notes...');
    fireEvent.change(searchInput, { target: { value: 'meeting' } });
    
    // Click search button
    fireEvent.click(screen.getByText('Rechercher'));
    
    // onSearch should be called with the input value
    expect(mockOnSearch).toHaveBeenCalledWith('meeting');
  });
  
  it('shows sort options when sort button is clicked', () => {
    render(
      <SearchBar 
        searchQuery="" 
        onSearch={mockOnSearch} 
        sortMode="updatedAt" 
        onSortChange={mockOnSortChange} 
      />
    );
    
    // Ensure sort button is available
    const sortButton = screen.getByLabelText('Options de tri');
    expect(sortButton).toBeInTheDocument();
    
    // Sort options should not be visible initially
    expect(screen.queryByText('Trier par titre')).not.toBeInTheDocument();
    
    // Click sort button
    fireEvent.click(sortButton);
    
    // Sort options should be visible
    expect(screen.getByText('Trier par titre')).toBeInTheDocument();
    expect(screen.getByText('Dernière modification')).toBeInTheDocument();
    expect(screen.getByText('Date de création')).toBeInTheDocument();
  });
  
  it('calls onSortChange when a sort option is selected', () => {
    render(
      <SearchBar 
        searchQuery="" 
        onSearch={mockOnSearch} 
        sortMode="updatedAt" 
        onSortChange={mockOnSortChange} 
      />
    );
    
    // Click sort button
    fireEvent.click(screen.getByLabelText('Options de tri'));
    
    // Click title sort option
    fireEvent.click(screen.getByText('Trier par titre'));
    
    // onSortChange should be called with 'title'
    expect(mockOnSortChange).toHaveBeenCalledWith('title');
  });
});
