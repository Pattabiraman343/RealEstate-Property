// components/ui/Button.js
export default function Button({ 
    children, 
    variant = 'primary', 
    className = '', 
    disabled = false,
    type = 'button',
    onClick 
  }) {
    const baseStyles = 'px-4 py-2 rounded-lg font-semibold transition duration-200';
    
    const variants = {
      primary: 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
      danger: 'bg-red-600 text-white hover:bg-red-700',
      outline: 'border-2 border-red-600 text-red-600 hover:bg-red-50',
      success: 'bg-green-600 text-white hover:bg-green-700',
    };
  
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      >
        {children}
      </button>
    );
  }