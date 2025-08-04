/**
 * Babel plugin to ensure React is properly initialized before any component renders.
 * This helps prevent "Cannot read property 'useMemo' of null" errors in Hermes engine.
 */
module.exports = function() {
  return {
    visitor: {
      Program: {
        enter(path) {
          // Check if this file uses React hooks
          let usesReactHooks = false;
          path.traverse({
            CallExpression(callPath) {
              const callee = callPath.get('callee');
              if (callee.isMemberExpression()) {
                const object = callee.get('object');
                const property = callee.get('property');
                if (
                  (object.isIdentifier({ name: 'React' }) || 
                   object.isIdentifier({ name: 'react' })) && 
                  property.isIdentifier() && 
                  property.node.name.startsWith('use')
                ) {
                  usesReactHooks = true;
                }
              } else if (callee.isIdentifier() && callee.node.name.startsWith('use')) {
                usesReactHooks = true;
              }
            }
          });

          // If this file uses React hooks, add the initialization code
          if (usesReactHooks) {
            // Add imports to ensure React is available
            const importReact = `
              // Initialize React to avoid Hermes issues
              if (global.React === undefined) {
                global.React = require('react');
              }
            `;
            
            // Add the code at the top of the file
            path.unshiftContainer('body', {
              type: 'ExpressionStatement',
              expression: {
                type: 'StringLiteral',
                value: importReact
              }
            });
          }
        }
      }
    }
  };
};
